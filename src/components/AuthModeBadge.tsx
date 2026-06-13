import type { AuthMode } from '../types';

type AuthModeBadgeProps = {
  authMode: AuthMode;
  label?: string;
};

export default function AuthModeBadge({ authMode, label = 'Auth mode' }: AuthModeBadgeProps) {
  return <p className="mode-pill">{label}: {authMode === 'full' ? 'Full OAuth' : 'Demo mock'}</p>;
}
