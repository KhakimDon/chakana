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
        dark: {
          DEFAULT: '#1C1C1C',
        },
        orange: {
          DEFAULT: '#FF831B',
        },
        red: {
          DEFAULT: '#FF3300',
        },
        green: {
          DEFAULT: '#13B541',
        },
        gray: {
          DEFAULT: '#A3A3A3',
        },
      },
    },
  },
  plugins: [],
}
