const storage = new Map<string, string>();

const mockStorage = {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => {
    storage.set(k, String(v));
  },
  removeItem: (k: string) => {
    storage.delete(k);
  },
  clear: () => {
    storage.clear();
  },
  get length() {
    return storage.size;
  },
  key: (i: number) => Array.from(storage.keys())[i] ?? null,
};

Object.defineProperty(globalThis, "localStorage", {
  value: mockStorage,
  writable: true,
  configurable: true,
});

if (typeof (globalThis as unknown as { window: unknown }).window === "undefined") {
  Object.defineProperty(globalThis, "window", {
    value: globalThis,
    writable: true,
    configurable: true,
  });
}
