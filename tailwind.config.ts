/** @type {import('tailwindcss').Config} */
import { Config } from 'tailwindcss'

export default <Partial<Config>>{
  mode: 'jit',
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '1344px',
        },
      },
      colors: {
        white: {
          DEFAULT: '#FFFFFF',
          100: '#F2F2F2',
        },
        dark: {
          DEFAULT: '#1C1C1C',
        },
        orange: {
          DEFAULT: '#ED2024',
        },
        red: {
          DEFAULT: '#FF3300',
        },
        green: {
          DEFAULT: '#13B541',
        },
        gray: {
          DEFAULT: '#A3A3A3',
          100: '#8F8F8F',
          200: '#DADADA',
          300: '#F7F7F7',
        },
        blue: {
          100: '#4DAAF8',
        },
      },
      lineHeight: {
        120: '120%',
        122: '122%',
        130: '130%',
        140: '140%',
      },
      borderRadius: {
        10: '10px',
      },
      boxShadow: {
        DEFAULT: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        map: '0px 6px 40px 0px rgba(28, 28, 28, 0.10)',
        card: '0px 4px 12px 0px rgba(28, 28, 28, 0.12);',
      },
    },
  },
  plugins: [],
}
