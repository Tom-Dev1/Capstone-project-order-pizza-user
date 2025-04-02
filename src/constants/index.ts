// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setItem = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
};

export const removeItem = (key: string): void => {
    localStorage.removeItem(key);
};

