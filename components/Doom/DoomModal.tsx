"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
};

// Keycodes internes DOOM
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_RCTRL = 0x80 + 0x1d; // 149
const KEY_RSHIFT = 0x80 + 0x2a; // 170
const KEY_RALT = 0x80 + 0x38; // 184
const KEY_LEFTARROW = 0xac; // 172
const KEY_UPARROW = 0xad; // 173
const KEY_RIGHTARROW = 0xae; // 174
const KEY_DOWNARROW = 0xaf; // 175

const convertirToucheDoom = (e: KeyboardEvent): number => {
  // Support WASD et ZQSD pour le déplacement
  switch (e.code) {
    case "KeyW":
    case "KeyZ":
    case "ArrowUp":
      return KEY_UPARROW;
    case "KeyS":
    case "ArrowDown":
      return KEY_DOWNARROW;
    case "KeyA":
    case "KeyQ":
    case "ArrowLeft":
      return KEY_LEFTARROW;
    case "KeyD":
    case "ArrowRight":
      return KEY_RIGHTARROW;
    case "ControlLeft":
    case "ControlRight":
      return KEY_RCTRL;
    case "Space":
      return KEY_SPACE;
    case "Enter":
    case "NumpadEnter":
      return KEY_ENTER;
    case "ShiftLeft":
    case "ShiftRight":
      return KEY_RSHIFT;
    case "AltLeft":
    case "AltRight":
      return KEY_RALT;
    case "Escape":
      return KEY_ESCAPE;
    default:
      break;
  }

  // Touches numériques (armes 1-7)
  if (e.keyCode >= 48 && e.keyCode <= 57) {
    return e.keyCode;
  }

  // Lettres A-Z
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    return e.keyCode + 32;
  }

  return e.keyCode;
};

export default function DoomModal({ ouvert, onFermer }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const doomInstanceRef = useRef<{
    exports: {
      main: () => void;
      doom_loop_step: () => void;
      add_browser_event: (type: number, keyCode: number) => void;
    };
  } | null>(null);

  const [estPleinEcran, setEstPleinEcran] = useState(false);
  const [enChargement, setEnChargement] = useState(true);
  const [afficherManetteMobile, setAfficherManetteMobile] = useState(false);
  const [messageAide, setMessageAide] = useState<string | null>(null);

  // Fonction pour envoyer un événement touche à DOOM
  const envoyerEvenementTouche = useCallback((type: 0 | 1, keyCode: number) => {
    if (doomInstanceRef.current?.exports?.add_browser_event) {
      doomInstanceRef.current.exports.add_browser_event(type, keyCode);
    }
  }, []);

  const vibrationHaptique = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // Ignorer si bloqué par les politiques du navigateur
      }
    }
  }, []);

  // Détection automatique si l'appareil est tactile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const aTactile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setAfficherManetteMobile(aTactile);
    }
  }, []);

  // Initialisation du moteur Wasm DOOM
  useEffect(() => {
    if (!ouvert) {
      // Nettoyage si on ferme la modale
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      doomInstanceRef.current = null;
      return;
    }

    setEnChargement(true);
    let estActif = true;

    const initialiserDoom = async () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const doomLargeur = 640;
        const doomHauteur = 400;

        // Mémoire partagée Wasm : 108 pages initiales (~6.9 Mo)
        const memory = new WebAssembly.Memory({ initial: 108 });

        const decoder = new TextDecoder("utf8");
        const lireChaineWasm = (offset: number, length: number) => {
          const bytes = new Uint8Array(memory.buffer, offset, length);
          return decoder.decode(bytes);
        };

        // Redirection propre de tous les logs vers console.log / console.warn
        // AUCUN log affiché dans l'interface visuelle !
        const importObject = {
          js: {
            js_console_log: (offset: number, length: number) => {
              const msg = lireChaineWasm(offset, length).trim();
              if (msg) console.log("%c[DOOM WASM]", "color: #ef4444; font-weight: bold;", msg);
            },
            js_stdout: (offset: number, length: number) => {
              const msg = lireChaineWasm(offset, length).trim();
              if (msg) console.log("%c[DOOM STDOUT]", "color: #3b82f6; font-weight: bold;", msg);
            },
            js_stderr: (offset: number, length: number) => {
              const msg = lireChaineWasm(offset, length).trim();
              if (msg) console.warn("%c[DOOM STDERR]", "color: #f59e0b; font-weight: bold;", msg);
            },
            js_milliseconds_since_start: () => performance.now(),
            js_draw_screen: (ptr: number) => {
              if (!canvas) return;
              const doomEcran = new Uint8ClampedArray(
                memory.buffer,
                ptr,
                doomLargeur * doomHauteur * 4
              );
              const donneesImage = new ImageData(doomEcran, doomLargeur, doomHauteur);
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.putImageData(donneesImage, 0, 0);
              }
            },
          },
          env: {
            memory: memory,
          },
        };

        // Chargement du binaire Wasm stocké localement
        const reponse = await fetch("/doom/doom.wasm");
        if (!reponse.ok) {
          throw new Error(`Échec du téléchargement Wasm: HTTP ${reponse.status}`);
        }
        const octets = await reponse.arrayBuffer();

        if (!estActif) return;

        const resultatWasm = await WebAssembly.instantiate(octets, importObject);
        const instance = resultatWasm.instance as unknown as {
          exports: {
            main: () => void;
            doom_loop_step: () => void;
            add_browser_event: (type: number, keyCode: number) => void;
          };
        };

        doomInstanceRef.current = instance;

        // Démarrage de DOOM
        instance.exports.main();

        if (!estActif) return;

        setEnChargement(false);
        setMessageAide("🎮 Appuyez sur Entrée pour commencer !");
        setTimeout(() => setMessageAide(null), 4000);

        // Boucle de rendu
        const loop = () => {
          if (!estActif) return;
          try {
            instance.exports.doom_loop_step();
          } catch (err) {
            console.error("[DOOM Loop Error]", err);
          }
          animFrameRef.current = requestAnimationFrame(loop);
        };

        animFrameRef.current = requestAnimationFrame(loop);

        // Donner le focus au canvas
        setTimeout(() => {
          canvas.focus();
        }, 100);
      } catch (err) {
        console.error("Erreur lors de l'initialisation de DOOM Wasm :", err);
        setEnChargement(false);
      }
    };

    initialiserDoom();

    return () => {
      estActif = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [ouvert]);

  // Gestion des événements clavier
  useEffect(() => {
    if (!ouvert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onFermer();
        return;
      }

      const doomCode = convertirToucheDoom(e);
      envoyerEvenementTouche(0 /* KeyDown */, doomCode);

      // Empêcher le défilement de la page avec les flèches ou espace
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const doomCode = convertirToucheDoom(e);
      envoyerEvenementTouche(1 /* KeyUp */, doomCode);

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [ouvert, onFermer, envoyerEvenementTouche]);

  const basculerPleinEcran = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setEstPleinEcran(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setEstPleinEcran(false);
    }
  };

  // Gestionnaire pour les boutons virtuels (D-Pad et actions)
  const creerGestionnaireBouton = (keyCode: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      vibrationHaptique();
      envoyerEvenementTouche(0, keyCode);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      envoyerEvenementTouche(1, keyCode);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      e.preventDefault();
      envoyerEvenementTouche(1, keyCode);
    },
  });

  if (!ouvert) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Jeu DOOM (1993)"
    >
      {/* Barre supérieure style borne d'arcade */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-red-950/70 bg-gradient-to-r from-red-950/90 via-black to-red-950/90 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-red-600" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm font-extrabold uppercase tracking-wider text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] sm:text-base">
                DOOM (1993)
              </h2>
              <span className="rounded bg-red-950 px-1.5 py-0.5 font-mono text-[10px] text-red-400 border border-red-800/50">
                WASM PUR
              </span>
            </div>
            <p className="hidden text-xs text-gray-400 md:block">
              « But can it run DOOM? YES. » · Konami Code débloqué
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Basculeur de manette virtuelle */}
          <button
            type="button"
            onClick={() => setAfficherManetteMobile((prev) => !prev)}
            aria-label="Afficher ou masquer la manette virtuelle"
            className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs transition ${
              afficherManetteMobile
                ? "border-red-600 bg-red-950/60 text-red-300"
                : "border-gray-800 bg-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            🎮 {afficherManetteMobile ? "Masquer manette" : "Manette"}
          </button>

          {/* Plein écran */}
          <button
            type="button"
            onClick={basculerPleinEcran}
            aria-label={estPleinEcran ? "Quitter le plein écran" : "Plein écran"}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 font-mono text-xs text-gray-300 transition hover:bg-gray-800 hover:text-white"
          >
            {estPleinEcran ? "⛶ Fenêtré" : "⛶ Plein écran"}
          </button>

          {/* Quitter */}
          <button
            type="button"
            onClick={onFermer}
            aria-label="Quitter DOOM et revenir au Pokédex"
            className="rounded-lg bg-red-600 px-4 py-1.5 font-mono text-xs font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95"
          >
            ✕ Quitter
          </button>
        </div>
      </header>

      {/* Guide des touches rapide Desktop */}
      <div className="hidden sm:flex flex-wrap items-center justify-between border-b border-gray-900 bg-black/95 px-4 py-1 text-[11px] font-mono text-gray-400">
        <div className="flex flex-wrap items-center gap-x-4">
          <span>🎮 <strong className="text-gray-200">Entrée</strong> : Démarrer</span>
          <span>🏃 <strong className="text-gray-200">Flèches / ZQSD</strong> : Se déplacer</span>
          <span>💥 <strong className="text-gray-200">Ctrl</strong> : Tirer</span>
          <span>🚪 <strong className="text-gray-200">Espace</strong> : Ouvrir portes</span>
          <span>⚡ <strong className="text-gray-200">Shift</strong> : Courir</span>
        </div>
        <span className="text-gray-500">
          💡 Tous les logs sont enregistrés dans <code className="text-red-400">console.log</code>
        </span>
      </div>

      {/* Message temporaire d'aide */}
      {messageAide && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 rounded-full border border-red-500/50 bg-red-950/90 px-4 py-1.5 font-mono text-xs font-bold text-red-200 shadow-xl backdrop-blur animate-bounce">
          {messageAide}
        </div>
      )}

      {/* Zone du jeu : 100% responsive et centrée */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Écran de chargement rétro */}
        {enChargement && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 p-4 text-center">
            <div className="size-12 rounded-full border-4 border-red-950 border-t-red-600 animate-spin mb-4" />
            <h3 className="font-mono text-lg font-bold text-red-500 uppercase tracking-widest animate-pulse">
              Initialisation WebAssembly...
            </h3>
            <p className="mt-2 font-mono text-xs text-gray-400">
              Chargement du binaire DOOM (1993) Wasm
            </p>
          </div>
        )}

        {/* Conteneur responsive du Canvas */}
        <div className="relative flex items-center justify-center size-full max-h-[82vh] max-w-full">
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            tabIndex={0}
            className="max-h-full max-w-full aspect-[16/10] w-auto h-auto object-contain rounded-lg border border-red-950/60 shadow-[0_0_50px_rgba(220,38,38,0.15)] outline-none focus:ring-2 focus:ring-red-600/40"
            style={{
              imageRendering: "pixelated",
            }}
          />

          {/* Effet cathodique scanlines subtil */}
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-25" />
        </div>

        {/* Manette tactile virtuelle (rétro Gamepad pour Mobile ou tactile) */}
        {afficherManetteMobile && (
          <div className="shrink-0 w-full max-w-md mx-auto pt-2 pb-1 px-4 z-20">
            <div className="flex items-center justify-between gap-4 bg-zinc-950/80 p-2.5 rounded-2xl border border-zinc-800/80 backdrop-blur">
              {/* D-Pad */}
              <div className="relative size-28 shrink-0">
                <button
                  type="button"
                  {...creerGestionnaireBouton(KEY_UPARROW)}
                  className="absolute top-0 left-9 size-10 rounded-t-lg bg-zinc-800 text-sm font-bold text-gray-200 active:bg-red-600 shadow-md border-t border-x border-zinc-700"
                >
                  ▲
                </button>
                <button
                  type="button"
                  {...creerGestionnaireBouton(KEY_DOWNARROW)}
                  className="absolute bottom-0 left-9 size-10 rounded-b-lg bg-zinc-800 text-sm font-bold text-gray-200 active:bg-red-600 shadow-md border-b border-x border-zinc-700"
                >
                  ▼
                </button>
                <button
                  type="button"
                  {...creerGestionnaireBouton(KEY_LEFTARROW)}
                  className="absolute top-9 left-0 size-10 rounded-l-lg bg-zinc-800 text-sm font-bold text-gray-200 active:bg-red-600 shadow-md border-l border-y border-zinc-700"
                >
                  ◀
                </button>
                <button
                  type="button"
                  {...creerGestionnaireBouton(KEY_RIGHTARROW)}
                  className="absolute top-9 right-0 size-10 rounded-r-lg bg-zinc-800 text-sm font-bold text-gray-200 active:bg-red-600 shadow-md border-r border-y border-zinc-700"
                >
                  ▶
                </button>
                <div className="absolute inset-9 bg-zinc-900 border border-zinc-800" />
              </div>

              {/* Bouton START (Entrée) au centre */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  {...creerGestionnaireBouton(KEY_ENTER)}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-mono font-bold text-gray-300 uppercase active:bg-green-600 border border-zinc-700 shadow"
                >
                  Start
                </button>
                <span className="text-[9px] font-mono text-gray-500">Entrée</span>
              </div>

              {/* Boutons d'action (Tir & Action) */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    {...creerGestionnaireBouton(KEY_SPACE)}
                    className="size-12 rounded-full bg-amber-600 text-xs font-bold text-white shadow-lg active:scale-95 active:bg-amber-700 border border-amber-400/30 flex items-center justify-center font-mono"
                  >
                    Ouvrir
                  </button>
                  <span className="text-[9px] font-mono text-gray-400 mt-0.5">Espace</span>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    {...creerGestionnaireBouton(KEY_RCTRL)}
                    className="size-12 rounded-full bg-red-600 text-xs font-bold text-white shadow-lg active:scale-95 active:bg-red-700 border border-red-400/30 flex items-center justify-center font-mono"
                  >
                    Tirer
                  </button>
                  <span className="text-[9px] font-mono text-gray-400 mt-0.5">Ctrl</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
