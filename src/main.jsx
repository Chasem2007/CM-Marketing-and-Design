import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './index.css';

/*
  ENTRY POINT — React starts here.
  Finds <div id="root"> in index.html and renders your app inside it.
*/

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  // Show a visible error rather than silently crashing
  document.getElementById('root').innerHTML =
    '<div style="background:#05090f;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;padding:40px">' +
    '<div><h2 style="color:#c9952c;margin-bottom:12px">Missing Clerk Key</h2>' +
    '<p style="color:#94a3b8">Add <code style="background:#1e293b;padding:2px 8px;border-radius:4px">VITE_CLERK_PUBLISHABLE_KEY</code> to your Netlify environment variables and redeploy.</p>' +
    '</div></div>';
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignInUrl="/" afterSignUpUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
