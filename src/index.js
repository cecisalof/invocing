import { createRoot } React from "react-dom/client";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

Sentry.init({
  dsn: "https://73105d819b7c42f9ae98b8d0316740d6@o222529.ingest.sentry.io/4505403569405952",
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [/^https:\/\/tramitgo\.com/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.5, // This sets the sample rate
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
