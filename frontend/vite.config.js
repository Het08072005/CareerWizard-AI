import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

try {
  const cssDir = path.resolve(__dirname, 'src/css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  const homeCss = path.resolve(__dirname, 'src/pages/Home.css');
  const internCss = path.resolve(__dirname, 'src/pages/internship/internship.css');
  const indexCss = path.resolve(__dirname, 'src/index.css');
  
  if (fs.existsSync(homeCss)) fs.renameSync(homeCss, path.join(cssDir, 'Home.css'));
  if (fs.existsSync(internCss)) fs.renameSync(internCss, path.join(cssDir, 'internship.css'));
  if (fs.existsSync(indexCss)) fs.renameSync(indexCss, path.join(cssDir, 'index.css'));
} catch (e) {
  console.error("Move failed:", e);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss(),],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
