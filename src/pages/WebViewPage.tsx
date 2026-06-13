import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import StatusMessage from '../components/StatusMessage';
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
        <EmptyState
          title="No URL saved"
          action={
            <button type="button" onClick={() => navigate('/settings')}>
              Go to Settings
            </button>
          }
        >
          Add a website URL in settings first.
        </EmptyState>
      </main>
    );
  }

  if (!normalizedUrl) {
    return (
      <main className="screen center-screen with-nav">
        <EmptyState
          title="Invalid URL"
          action={
            <button type="button" onClick={() => navigate('/settings')}>
              Edit URL
            </button>
          }
        >
          The saved URL cannot be opened.
        </EmptyState>
      </main>
    );
  }

  return (
    <main className="screen webview-screen with-nav">
      <PageHeader
        compact
        eyebrow="Web View"
        title={new URL(normalizedUrl).hostname}
        subtitle={selectedDevice ? <p className="muted">Device: {selectedDevice.name}</p> : null}
        action={
          <button type="button" className="secondary-button" onClick={() => setFrameKey((current) => current + 1)}>
            Refresh
          </button>
        }
      />

      {online === false ? (
        <EmptyState title="You are offline">Connect to WiFi or cellular data to load this website.</EmptyState>
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

      <StatusMessage tone="error">{browserError}</StatusMessage>
    </main>
  );
}
