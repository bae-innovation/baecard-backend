/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_MSW?: string;
  readonly VITE_AXIOM_TOKEN?: string;
  readonly VITE_AXIOM_DATASET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
