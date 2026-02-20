export function canUseDOM(): boolean {
  return typeof window !== 'undefined';
}

const safeGet = (storage: Storage, key: string): string | null => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (storage: Storage, key: string, value: string): boolean => {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemove = (storage: Storage, key: string): boolean => {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export function safeSessionGet(key: string): string | null {
  if (!canUseDOM()) return null;
  return safeGet(window.sessionStorage, key);
}

export function safeSessionSet(key: string, value: string): boolean {
  if (!canUseDOM()) return false;
  return safeSet(window.sessionStorage, key, value);
}

export function safeSessionRemove(key: string): boolean {
  if (!canUseDOM()) return false;
  return safeRemove(window.sessionStorage, key);
}

export function safeLocalGet(key: string): string | null {
  if (!canUseDOM()) return null;
  return safeGet(window.localStorage, key);
}

export function safeLocalSet(key: string, value: string): boolean {
  if (!canUseDOM()) return false;
  return safeSet(window.localStorage, key, value);
}

export function safeLocalRemove(key: string): boolean {
  if (!canUseDOM()) return false;
  return safeRemove(window.localStorage, key);
}
