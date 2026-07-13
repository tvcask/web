const ACTIVE_IMPORT_KEY = "tvcask.activeImportId";
const ACTIVE_IMPORT_EVENT = "tvcask:active-import";

function notifyActiveImport(id: string | null): void {
  window.dispatchEvent(new CustomEvent(ACTIVE_IMPORT_EVENT, { detail: id }));
}

export function readActiveImport(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_IMPORT_KEY);
  } catch {
    return null;
  }
}

export function rememberActiveImport(id: string): void {
  try {
    window.localStorage.setItem(ACTIVE_IMPORT_KEY, id);
  } catch {
    // Import still works when browser storage is unavailable.
  }
  notifyActiveImport(id);
}

export function forgetActiveImport(id?: string): void {
  if (id && readActiveImport() !== id) {
    return;
  }
  try {
    window.localStorage.removeItem(ACTIVE_IMPORT_KEY);
  } catch {
    // Nothing else to clean up.
  }
  notifyActiveImport(null);
}

export function onActiveImport(listener: (id: string | null) => void): () => void {
  const handle = (event: Event) => listener((event as CustomEvent<string | null>).detail);
  window.addEventListener(ACTIVE_IMPORT_EVENT, handle);
  return () => window.removeEventListener(ACTIVE_IMPORT_EVENT, handle);
}
