// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'Node16',
      },
    },
  },

  ssr: true,

  app: {
    head: {
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
      ],
      meta: [
        {
          name: 'og:site_name',
          content: 'Xolodilnik',
        },
        {
          name: 'keywords',
          content: 'Xolodilnik, Xolodilnik sayti',
        },
        {
          name: 'apple-itunes-app',
          content:
            'app-id=6499511120, app-argument=https://apps.apple.com/uz/app/xolodilnik/id6499511120',
        },
        {
          // Google Search Console website verification
          name: 'google-site-verification',
          content: 'Ip3Y5Anc5Hk6iGPHu9U0sOC_ACgQOYWPqNJrtw7Ao3Y',
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
    'nuxt-smart-app-banner',
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
    'nuxt-gtag',
    [
      'yandex-metrika-module-nuxt3',
      {
        id: 97948478,
        webvisor: true,
      },
    ],
  ],

  'nuxt-smart-app-banner': {
    bannerOptions: {
      title: 'Xolodilnik',
      androidAppId: 'org.uicgroup.xolodilnikapp',
      icon: 'https://play-lh.googleusercontent.com/hHcwYBbrll3bQJuQ3szijqMd0VJ6ui48pntqNmIEj-ujBlA33Bc_Vr951uV_U3UMQLU=w240-h480-rw',
      iosAppId: '6499511120',
      appStoreLanguage: 'en',
    },
  },

  i18n: {
    langDir: 'locales',
    baseUrl: 'https://xolodilnik.uz',
    locales: [
      { code: 'ru', iso: 'ru-RU', file: 'ru' },
      { code: 'uz', iso: 'uz', file: 'uz' },
      // { code: 'en', iso: 'en', file: 'en' },
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

  // plugins: [
  //   {
  //     src: '~/plugins/firebase',
  //     mode: 'client',
  //   },
  // ],

  // plugins: [
  //   { src: '~/plugins/firebase-messaging', mode: 'client' },
  //   // Other plugins...
  // ],

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

  gtag: {
    id: process.env.GOOGLE_TAG_ID,
  },
  compatibilityDate: '2024-08-20',
})
