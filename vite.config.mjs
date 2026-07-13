import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import * as path from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),  // ← Vuetify Plugin hinzufügen
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern"
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src',
      ),
    },
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.vue',
      '.scss',
    ],
  },
})
