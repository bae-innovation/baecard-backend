/** @deprecated API client stub — use Inertia router for server requests. */
type StubResponse = { json: () => Promise<unknown> };

const stubResponse: StubResponse = {
  json: async () => ({}),
};

export const baecardApiClient: {
  get: (...args: unknown[]) => StubResponse;
  post: (...args: unknown[]) => StubResponse;
  put: (...args: unknown[]) => StubResponse;
  patch: (...args: unknown[]) => StubResponse;
  delete: (...args: unknown[]) => StubResponse;
} = {
  get: () => stubResponse,
  post: () => stubResponse,
  put: () => stubResponse,
  patch: () => stubResponse,
  delete: () => stubResponse,
};
