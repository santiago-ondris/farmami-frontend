import './instrument.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.jsx'
import './styles/variables.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root'), {
  onUncaughtError: Sentry.reactErrorHandler(),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
