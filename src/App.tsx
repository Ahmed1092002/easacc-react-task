import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import WebViewPage from './pages/WebViewPage';
import { useApp } from './state/AppContext';

function AppNavigation() {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser || location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavLink to="/settings">Settings</NavLink>
      <NavLink to="/webview">Web View</NavLink>
    </nav>
  );
}

function RequireLogin({ children }: { children: React.ReactNode }) {
  const { currentUser, isReady } = useApp();

  if (!isReady) {
    return <main className="screen center-screen">Loading...</main>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/settings"
          element={
            <RequireLogin>
              <SettingsPage />
            </RequireLogin>
          }
        />
        <Route
          path="/webview"
          element={
            <RequireLogin>
              <WebViewPage />
            </RequireLogin>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <AppNavigation />
    </div>
  );
}
