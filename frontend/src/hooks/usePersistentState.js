import { useState, useEffect } from 'react';

export const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue) {
                const parsedValue = JSON.parse(storedValue);
                return (typeof parsedValue === 'object' && parsedValue !== null) ? parsedValue : defaultValue;
            }
            return defaultValue;
        } catch (error) {
            console.error("Error reading localStorage key “" + key + "”:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing localStorage key “" + key + "” (Storage likely full):", error);
        }
    }, [key, state]);

    return [state, setState];
};
