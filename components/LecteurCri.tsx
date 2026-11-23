"use client";

import { useRef, useState } from "react";

type Props = {
  urlAudio?: string;
  nomPokemon: string;
};

export default function LecteurCri({ urlAudio, nomPokemon }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enLecture, setEnLecture] = useState(false);
  const [erreur, setErreur] = useState(false);

  if (!urlAudio) return null;

  const jouerCri = () => {
    if (!audioRef.current) return;
    setErreur(false);

    if (enLecture) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setEnLecture(false);
      return;
    }

    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => setEnLecture(true))
      .catch(() => {
        setErreur(true);
        setEnLecture(false);
      });
  };

  return (
    <div className="inline-flex items-center gap-2">
      <audio
        ref={audioRef}
        src={urlAudio}
        preload="none"
        onEnded={() => setEnLecture(false)}
        onError={() => {
          setErreur(true);
          setEnLecture(false);
        }}
      />
      <button
        type="button"
        onClick={jouerCri}
        disabled={erreur}
        title={erreur ? "Cri non disponible" : `Écouter le cri de ${nomPokemon}`}
        aria-label={`Écouter le cri de ${nomPokemon}`}
        className={`group relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs font-bold transition shadow-sm ${
          enLecture
            ? "border-red-500 bg-red-500 text-white shadow-red-500/25 animate-pulse"
            : "border-gray-200 bg-white text-gray-700 hover:border-red-400 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-red-500 dark:hover:text-red-400"
        } ${erreur ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
      >
        <span className="text-base leading-none">
          {enLecture ? "🔊" : "🔉"}
        </span>
        <span>{enLecture ? "Cri en cours..." : "Cri Pokédex"}</span>

        {/* Animation d'ondes sonores quand la lecture est active */}
        {enLecture && (
          <span className="flex items-center gap-0.5">
            <span className="h-2 w-0.5 animate-bounce bg-white rounded-full" />
            <span className="h-3.5 w-0.5 animate-bounce bg-white rounded-full [animation-delay:0.15s]" />
            <span className="h-2 w-0.5 animate-bounce bg-white rounded-full [animation-delay:0.3s]" />
          </span>
        )}
      </button>
    </div>
  );
}
