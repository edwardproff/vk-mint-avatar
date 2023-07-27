export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            contractAddress: '0xc3a9766e07754cC1894E5c0A2459d23A676dDD0D',
            vkAppId: 51714131
        }
    },
    modules: [
        '@pinia/nuxt',
        '@vueuse/nuxt',
    ],
    ssr: false,
    css: [
        "@/assets/scss/app.scss"
    ],
    vite: {
        esbuild: {
            target: "esnext",
        },
        build: {
            target: "esnext",
        },
        define: {
            "process.env.BROWSER": true,
        },
    },
});
