// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'Xolodilnik',
      htmlAttrs: {
        lang: 'ru',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `/favicon.svg`,
        },
        {
          rel: 'canonical',
          href: '',
        },
        {
          rel: 'preconnect',
          href: 'https://xolodilnik.uz',
        },
      ],
    },
  },
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/_transitions.css',
    '~/assets/css/_toastification.css',
    '~/assets/fonts/fonts.css',
    'vue-toastification/dist/index.css',
    'swiper/css',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // automatically imports `defineStore`
          'defineStore', // import { defineStore } from 'pinia'
          ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
        ],
      },
    ],
    '@nuxt/image',
  ],
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  runtimeConfig: {
    public: {
      baseURL: 'localhost',
    },
  },
})
