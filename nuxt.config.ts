export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            contractAddress: '0x95901969f57F2a41067D531864fF5D508Ae6C652',
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
