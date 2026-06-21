const AUTH_ONLY_PATHS = ['/login', '/forgot-password', '/reset-password'];

/** Safe internal redirect after login (prevents open redirects). */
export function resolveLoginRedirect(redirect?: string): string {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/';
  }

  if (AUTH_ONLY_PATHS.some((path) => redirect === path || redirect.startsWith(`${path}?`))) {
    return '/';
  }

  return redirect;
}
