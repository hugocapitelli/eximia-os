import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';

// ============================================
// SENTRY INITIALIZATION
// ============================================
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    // Filter out sensitive data
    beforeSend(event) {
      // Remove sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.filter(
          breadcrumb => !breadcrumb.message?.includes('password')
        );
      }
      return event;
    },
  });
  console.log(`✅ Sentry initialized for environment: ${ENVIRONMENT}`);
} else {
  console.warn('⚠️ VITE_SENTRY_DSN not configured - error tracking disabled');
}

// ============================================
// APP INITIALIZATION
// ============================================
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// ============================================
// ERROR BOUNDARY FALLBACK
// ============================================
function ErrorFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ color: '#dc2626', marginBottom: '16px' }}>
        Oops! Algo deu errado
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Ocorreu um erro inesperado. Nossa equipe foi notificada.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Recarregar página
      </button>
    </div>
  );
}
