import { resolve } from 'path'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: false,
  ssr: false,
  alias: {
    'a2ui-vue': resolve(__dirname, '../src/index.ts'),
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
  tailwindcss: { configPath: 'tailwind.config.ts' },
  compatibilityDate: '2025-01-01',
})
