export const getSessionStorageOrDefault = <T>(
  key: string,
  defaultValue: T
): T => {
  const storedValue = sessionStorage.getItem(key);
  if (!storedValue) {
    return defaultValue;
  }
  return JSON.parse(storedValue);
};

export const updateSessionStorage = <T>(key: string, value: T | string) => {
  if (!value) {
    sessionStorage.removeItem(key);
    return;
  }

  if (!(value instanceof String)) {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value as string);
};
