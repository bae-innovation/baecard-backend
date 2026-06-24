export function resolveUserAvatarUrl(user: {
  avatar_url?: string | null;
  avatar?: string | null;
}): string | undefined {
  return user.avatar_url ?? user.avatar ?? undefined;
}
