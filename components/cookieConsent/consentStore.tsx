import { useSyncExternalStore } from "react";

export type ConsentValue = "granted" | "denied";

const STORAGE_KEY = "ga-consent";
const listeners = new Set<() => void>();

function readStoredConsent(): ConsentValue | null {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === "granted" || stored === "denied" ? stored : null;
    } catch {
        // localStorage indisponible (navigation privée stricte) : pas de choix.
        return null;
    }
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    // Propage le choix fait dans un autre onglet (l'événement `storage` ne se
    // déclenche que dans les onglets autres que celui ayant écrit la valeur).
    window.addEventListener("storage", listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", listener);
    };
}

// Côté serveur, aucun choix n'est connu : on rend comme « pas encore décidé ».
// useSyncExternalStore réconcilie ensuite avec la valeur client après hydratation,
// sans erreur de mismatch.
function getServerSnapshot(): ConsentValue | null {
    return null;
}

function setConsent(value: ConsentValue): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
        // Écriture impossible : le choix ne sera pas persisté entre les sessions.
    }
    listeners.forEach((listener) => listener());
}

type ConsentApi = {
    /** `null` tant que l'utilisateur n'a pas fait de choix. */
    consent: ConsentValue | null;
    accept: () => void;
    decline: () => void;
};

export function useConsent(): ConsentApi {
    const consent = useSyncExternalStore(
        subscribe,
        readStoredConsent,
        getServerSnapshot
    );

    return {
        consent,
        accept: () => setConsent("granted"),
        decline: () => setConsent("denied"),
    };
}
