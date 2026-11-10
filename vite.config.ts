import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Multi-page build: the site has two real HTML entry points now --
 * index.html (the 3D journey) and changelog.html (a lightweight static
 * changelog page that reuses the same content/ data but never loads
 * Three.js/Lenis). Vite only auto-detects index.html by default, so any
 * extra root-level HTML page must be declared here or `vite build` will
 * silently drop it from the production bundle (dev server serves any
 * file in root regardless, which is why this gap is easy to miss until
 * a real deploy).
 */
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        changelog: resolve(__dirname, 'changelog.html'),
      },
    },
  },
});
