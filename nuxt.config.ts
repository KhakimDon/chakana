// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'Node16',
      },
    },
  },
  ssr: false,
  app: {
    head: {
      title: 'Холодильник Онлайн',
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
    '@nuxtjs/device',
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    '@nuxtjs/i18n',
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

  i18n: {
    langDir: 'locales',
    baseUrl: 'https://xolodilnik.uz',
    locales: [
      { code: 'ru', iso: 'ru-RU', file: 'ru' },
      { code: 'uz', iso: 'uz', file: 'uz' },
      { code: 'en', iso: 'en', file: 'en' },
    ],
    lazy: true,
    useCookie: true,
    cookieKey: 'i18n_redirected',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true, // recommended
      fallbackLocale: 'uz',
    },
    defaultLocale: 'uz',
    strategy: 'prefix_and_default',
  },
  nitro: {
    serveStatic: true,
  },
  build: {
    transpile: ['vue-toastification'],
  },
  devServerHandlers: [],
  runtimeConfig: {
    public: {
      baseURL: 'localhost',
    },
  },
})
