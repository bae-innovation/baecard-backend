export function isAxiomConfigured(): boolean {
    return false;
}

export function AxiomWebVitals() {
    return null;
}

export function useLogger() {
    return {
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        debug: console.debug.bind(console),
    };
}

export const axiomLogger = {
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console),
};
