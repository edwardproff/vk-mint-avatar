export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            contractAddress: '0x9d5a0A411f4f103774469d2Ba0A86382D706Aaa2',
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
