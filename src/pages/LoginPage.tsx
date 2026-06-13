import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import type { LoginProvider } from '../types';

export default function LoginPage() {
  const { authMode, currentUser, setAuthMode, signIn, signOut } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<LoginProvider | null>(null);

  async function handleLogin(provider: LoginProvider) {
    setError('');
    setIsLoading(provider);

    try {
      await signIn(provider);
      navigate('/settings');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <main className="screen login-screen">
      <section className="login-panel">
        <div>
          <p className="eyebrow">React developer task</p>
          <h1>Easacc Mobile Portal</h1>
          <p className="muted">Sign in, choose the website URL, select a nearby device, and open the site in the app.</p>
        </div>

        <label className="field-label" htmlFor="authMode">
          Authentication mode
        </label>
        <select
          id="authMode"
          value={authMode}
          onChange={(event) => void setAuthMode(event.target.value === 'full' ? 'full' : 'demo')}
        >
          <option value="demo">Demo mode</option>
          <option value="full">Full OAuth mode</option>
        </select>

        <div className="button-stack">
          <button type="button" className="provider-button google" onClick={() => void handleLogin('google')}>
            {isLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
          </button>
          <button type="button" className="provider-button facebook" onClick={() => void handleLogin('facebook')}>
            {isLoading === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}
          </button>
        </div>

        {error ? <p className="status error">{error}</p> : null}

        {currentUser ? (
          <div className="signed-in-summary">
            <span>{currentUser.name}</span>
            <button type="button" className="text-button" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
