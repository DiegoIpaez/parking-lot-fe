import { User } from '@/types';

export function getInitials(
  user: Pick<User, 'firstName' | 'lastName'>
): string {
  const { firstName, lastName } = user;
  if (!firstName?.trim()) return '';

  const firstInitial = firstName?.trim?.()?.[0]?.toUpperCase?.();
  if (!lastName?.trim()) return firstInitial;

  const lastInitial = lastName?.trim?.()?.[0]?.toUpperCase?.();
  return firstInitial + lastInitial;
}
