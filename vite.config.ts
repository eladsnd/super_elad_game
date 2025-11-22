import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: true, // Needed for Docker
        port: 3000,
    },
    build: {
        outDir: 'dist',
    },
});
