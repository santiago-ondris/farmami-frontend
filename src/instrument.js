import React from 'react';
import * as Sentry from '@sentry/react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: Boolean(import.meta.env.VITE_SENTRY_DSN),
  environment:
    import.meta.env.VITE_SENTRY_ENVIRONMENT ||
    import.meta.env.MODE,
  integrations: [
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  sampleRate: 1.0,
  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
  tracePropagationTargets: [
    'localhost',
    ...(apiUrl ? [apiUrl] : []),
  ],
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: false,
      response: false,
    },
    urlQueryParams: false,
    httpBodies: [],
    stackFrameVariables: false,
    genAI: {
      inputs: false,
      outputs: false,
    },
  },
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications.',
    /^Script error\.?$/,
  ],
  denyUrls: [
    /extensions\//i,
    /^chrome(-extension)?:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
  ],
});
