import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN

export default defineConfig({
  build: {
    sourcemap: sentryAuthToken ? 'hidden' : false,
  },
  plugins: [
    react(),
    tailwindcss(),
    ...(sentryAuthToken
      ? [
          sentryVitePlugin({
            authToken: sentryAuthToken,
            org: process.env.SENTRY_ORG || 'santiago-ondris',
            project: process.env.SENTRY_PROJECT || 'farmami-frontend',
            sourcemaps: {
              filesToDeleteAfterUpload: './dist/**/*.map',
            },
          }),
        ]
      : []),
  ],
})
