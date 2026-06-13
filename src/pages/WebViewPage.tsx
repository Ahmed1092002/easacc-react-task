import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openUrlInApp, openUrlInSystemBrowser } from '../services/inAppBrowser';
import { isOnline } from '../services/network';
import { normalizeUrl } from '../services/url';
import { useApp } from '../state/AppContext';

export default function WebViewPage() {
  const { selectedDevice, webUrl } = useApp();
  const navigate = useNavigate();
  const [online, setOnline] = useState<boolean | null>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [browserError, setBrowserError] = useState('');

  const normalizedUrl = useMemo(() => {
    if (!webUrl) {
      return '';
    }

    try {
      return normalizeUrl(webUrl);
    } catch {
      return '';
    }
  }, [webUrl]);

  useEffect(() => {
    isOnline().then(setOnline).catch(() => setOnline(false));
  }, []);

  async function handleOpenInApp() {
    if (!normalizedUrl) {
      return;
    }

    setBrowserError('');
    try {
      await openUrlInApp(normalizedUrl);
    } catch (error) {
      setBrowserError(error instanceof Error ? error.message : 'Unable to open the in-app browser.');
    }
  }

  async function handleOpenSystemBrowser() {
    if (!normalizedUrl) {
      return;
    }

    setBrowserError('');
    try {
      await openUrlInSystemBrowser(normalizedUrl);
    } catch (error) {
      setBrowserError(error instanceof Error ? error.message : 'Unable to open the browser.');
    }
  }

  if (!webUrl) {
    return (
      <main className="screen center-screen with-nav">
        <section className="empty-state">
          <h1>No URL saved</h1>
          <p className="muted">Add a website URL in settings first.</p>
          <button type="button" onClick={() => navigate('/settings')}>
            Go to Settings
          </button>
        </section>
      </main>
    );
  }

  if (!normalizedUrl) {
    return (
      <main className="screen center-screen with-nav">
        <section className="empty-state">
          <h1>Invalid URL</h1>
          <p className="muted">The saved URL cannot be opened.</p>
          <button type="button" onClick={() => navigate('/settings')}>
            Edit URL
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="screen webview-screen with-nav">
      <header className="page-header compact">
        <div>
          <p className="eyebrow">Web View</p>
          <h1>{new URL(normalizedUrl).hostname}</h1>
          {selectedDevice ? <p className="muted">Device: {selectedDevice.name}</p> : null}
        </div>
        <button type="button" className="secondary-button" onClick={() => setFrameKey((current) => current + 1)}>
          Refresh
        </button>
      </header>

      {online === false ? (
        <section className="empty-state">
          <h2>You are offline</h2>
          <p className="muted">Connect to WiFi or cellular data to load this website.</p>
        </section>
      ) : (
        <>
          <p className="embed-note">
            Some websites block embedded previews for security. If the frame refuses to connect, open it in a new tab.
          </p>
          <section className="webview-frame">
            <iframe
              key={frameKey}
              title="Configured website"
              src={normalizedUrl}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            />
          </section>
        </>
      )}

      <div className="webview-actions">
        <button type="button" onClick={() => void handleOpenInApp()}>
          Open in new tab
        </button>
        <button type="button" className="secondary-button" onClick={() => void handleOpenSystemBrowser()}>
          Open browser tab
        </button>
      </div>

      {browserError ? <p className="status error">{browserError}</p> : null}
    </main>
  );
}
