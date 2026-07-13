const ACTIVE_IMPORT_KEY = "tvcask.activeImportId";

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
}
