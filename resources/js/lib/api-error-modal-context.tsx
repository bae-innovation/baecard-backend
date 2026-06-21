import { createContext, useContext } from 'react';

export type ApiErrorModalContextValue = {
  /** Show the modal with the API / validation message. */
  show: (message: string) => void;
};

export const ApiErrorModalContext = createContext<ApiErrorModalContextValue>({
  show: () => {
    /* default no-op until provider mounts */
  },
});

export function useApiErrorModal(): ApiErrorModalContextValue {
  return useContext(ApiErrorModalContext);
}
