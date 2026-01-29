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
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: `/new-favicon.svg`,
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
    'swiper/css/pagination',
  ],

  modules: [
    '@nuxtjs/device',
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    'nuxt-simple-sitemap',
    'nuxt-simple-robots',
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
    'nuxt3-meta-pixel',
    'nuxt-gtag',
    'nuxt3-meta-pixel',
    // 'nuxt-simple-robots',
    // 'nuxt-simple-sitemap',
    [
      'yandex-metrika-module-nuxt3',
      {
        id: 97948478,
        webvisor: true,
      },
    ],
  ],

  facebook: {
    /* module options */
    track: 'PageView',
    pixelId: '1032075698305757',
    autoPageView: true,
    disabled: false,
  },

  i18n: {
    langDir: 'locales',
    baseUrl: 'https://xolodilnik.uz',
    locales: [
      { code: 'ru', iso: 'ru-RU', file: 'ru.ts' },
      { code: 'uz', iso: 'uz', file: 'uz.ts' },
      // { code: 'en', iso: 'en', file: 'en.ts' },
    ],
    lazy: false, // Переводы загружаются через плагин i18n-loader.client.ts
    useCookie: true,
    cookieKey: 'i18n_redirected',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true,
      fallbackLocale: 'uz',
    },
    defaultLocale: 'uz',
    strategy: 'prefix_and_default',
  },

  routeRules: {
    '/': {
      sitemap: {
        changefreq: 'daily',
        priority: 1,
        lastmod: new Date().toString('yyyy-mm-ddThh:mm:ss:zzz'),
      },
    },
    '/ru': {
      sitemap: {
        changefreq: 'daily',
        priority: 1,
        lastmod: new Date().toString('yyyy-mm-ddThh:mm:ss:zzz'),
      },
    },
  },
  sitemap: {
    exclude: [
      '/profile/**',
      '/profile',
      '/payment/**',
      '/payment',
      '/cart/**',
      '/cart',
    ],
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      {
        label: 'Change Frequency',
        select: 'sitemap:changefreq',
        width: '12.5%',
      },
    ],
    sitemaps: {
      products: {
        includeAppSources: false,

        sources: ['/api/__sitemap__/urls/products'],
      },
    },
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
