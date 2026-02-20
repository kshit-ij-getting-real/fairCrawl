export function canUseDOM(): boolean {
  return typeof window !== 'undefined';
}

const getStorage = (kind: 'localStorage' | 'sessionStorage'): Storage | null => {
  if (!canUseDOM()) return null;

  try {
    return window[kind];
  } catch {
    return null;
  }
};

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
  const storage = getStorage('sessionStorage');
  if (!storage) return null;
  return safeGet(storage, key);
}

export function safeSessionSet(key: string, value: string): boolean {
  const storage = getStorage('sessionStorage');
  if (!storage) return false;
  return safeSet(storage, key, value);
}

export function safeSessionRemove(key: string): boolean {
  const storage = getStorage('sessionStorage');
  if (!storage) return false;
  return safeRemove(storage, key);
}

export function safeLocalGet(key: string): string | null {
  const storage = getStorage('localStorage');
  if (!storage) return null;
  return safeGet(storage, key);
}

export function safeLocalSet(key: string, value: string): boolean {
  const storage = getStorage('localStorage');
  if (!storage) return false;
  return safeSet(storage, key, value);
}

export function safeLocalRemove(key: string): boolean {
  const storage = getStorage('localStorage');
  if (!storage) return false;
  return safeRemove(storage, key);
}
