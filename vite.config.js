import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    publicDir: false,
    build: {
        outDir: resolve(__dirname, 'resources/dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'resources/js/irep-admin/src/main.ts'),
            output: {
                entryFileNames: 'irep-admin.js',
                chunkFileNames: 'irep-admin-[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) return 'irep-admin.css';
                    return '[name][extname]';
                },
            },
        },
    },
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: [
            {
                find: /^ire-preview$/,
                replacement: resolve(__dirname, 'resources/js/ire-preview-library/dist/lib.es.js'),
            },
            {
                find: 'ire-preview/dist/styles.css',
                replacement: resolve(__dirname, 'resources/js/ire-preview-library/dist/styles.css'),
            },
            {
                find: '@components',
                replacement: resolve(__dirname, 'resources/js/irep-admin/src/components'),
            },
            {
                find: /^@\/(src|types)(\/.*)?$/,
                replacement: `${resolve(__dirname, 'resources/js/irep-admin')}/$1$2`,
            },
        ],
    },
});
