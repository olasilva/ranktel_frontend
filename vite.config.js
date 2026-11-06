import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const defaultApiUrl = mode === 'development'
    ? 'http://localhost:5000'
    : 'https://ranktel-backend.onrender.com';
  const apiUrl = (env.VITE_API_URL || defaultApiUrl).replace(/\/+$/, '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: { '/api': apiUrl },
    },
  };
});
