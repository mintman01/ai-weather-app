import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read .env file to get LLM config for proxy headers
function readEnvVar(key) {
  try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8')
    const match = envFile.match(new RegExp(`^${key}=(.*)$`, 'm'))
    return match?.[1]?.trim()
  } catch {
    return null
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/weather': {
        target: 'https://api.open-meteo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, ''),
      },
      '/api/geocoding': {
        target: 'https://geocoding-api.open-meteo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/geocoding/, ''),
      },
      '/api/nvidia': {
        target: readEnvVar('VITE_LLM_ENDPOINT')?.replace(/\/v1\/chat\/completions$/, '') || 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nvidia/, ''),
        configure: (proxy) => {
          const apiKey = readEnvVar('VITE_NVIDIA_API_KEY')
          if (apiKey) {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${apiKey}`)
            })
          }
        },
      },
    },
  },
})