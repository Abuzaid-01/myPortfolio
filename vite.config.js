import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Fills __SITE_URL__ in index.html (canonical + social-share tags).
// Set VITE_SITE_URL, or let Vercel's production URL be used automatically.
const siteUrl = () => {
  const env = process.env
  const url = env.VITE_SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  return url.replace(/\/+$/, '')
}
const siteUrlPlugin = () => ({
  name: 'site-url',
  transformIndexHtml: (html) => {
    const url = siteUrl()
    // no known domain yet: drop the tags that need an absolute URL
    if (!url) return html.split('\n').filter((l) => !/canonical|og:url|"url":/.test(l)).join('\n').replaceAll('__SITE_URL__', '')
    return html.replaceAll('__SITE_URL__', url)
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin()],
  build: { chunkSizeWarningLimit: 1500 }, // react-pdf chunk is lazy-loaded on purpose
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
