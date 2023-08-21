export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            contractAddress: '0xCBee492c6A1F37abdEaff712513bC20639548a35',
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
