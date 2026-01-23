import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api').replace(/\/$/, '');

type BackendStatusProps = { compact?: boolean };

export function BackendStatus({ compact }: BackendStatusProps) {
  const [running, setRunning] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/health`)
      .then((res) => {
        if (cancelled) return;
        setRunning(res.ok);
      })
      .catch(() => {
        if (!cancelled) setRunning(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        fontSize: '0.75rem',
        color: running === null ? '#6b7280' : running ? '#16a34a' : '#dc2626',
        marginTop: compact ? 0 : '1rem',
        textAlign: compact ? 'left' : 'center',
      }}
    >
      {running === null ? 'Checking...' : running ? 'Backend is running' : 'Backend unavailable'}
    </div>
  );
}
