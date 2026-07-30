import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages proje sitesi olarak yayınlanacağı için (kullanıcı.github.io
// yerine kullanıcı.github.io/tilkitopya/ şeklinde), base yolu repo adıyla
// eşleşmeli. Repo adı değişirse burası da güncellenmeli.
export default defineConfig({
  plugins: [react()],
  base: '/tilkitopya/',
})
