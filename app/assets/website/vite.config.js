import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        symfonyPlugin(),
        tailwindcss(),
    ],
    base: '/build/website/',
    build: {
        outDir: '../../public/build/website',
        rollupOptions: {
            input: {
                app: "./src/app.js"
            },
        }
    },
});
