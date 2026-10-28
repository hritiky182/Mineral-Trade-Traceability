import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F5F9',
          100: '#E4ECF2',
          200: '#C5D8E4',
          300: '#9DBFD3',
          400: '#6A9EC0',
          500: '#3D7A9F',
          600: '#234C6E',
          700: '#183750', // Secondary navy
          800: '#10243A', // Primary navy
          900: '#0C1B2B',
          950: '#060E18', // Deepest dark navy
        },
        teal: {
          50: '#E7F5F2',  // Light teal
          100: '#CEF0EB',
          200: '#B6E8E2',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F9D92', // Primary teal
          700: '#0E857C',
          800: '#0A736B',
          900: '#064E48',
          950: '#032C29',
        },
        brand: {
          bg: '#F5F7FA',       // Main background
          card: '#FFFFFF',     // Card background
          text: '#172B3A',     // Primary text
          muted: '#667789',    // Secondary text
          border: '#E1E7ED',   // Borders
          'border-light': '#EEF2F6',
          success: '#18845B',  // Success
          'success-bg': '#E8F5EE',
          warning: '#B7791F',  // Warning
          'warning-bg': '#FEF8EC',
          danger: '#C64747',   // Error
          'danger-bg': '#FDF1F1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 1px 0 rgba(16, 36, 58, 0.04)',
        'xs': '0 1px 2px 0 rgba(16, 36, 58, 0.05)',
        'subtle': '0 1px 3px 0 rgba(16, 36, 58, 0.04), 0 1px 2px 0 rgba(16, 36, 58, 0.02)',
        'card': '0 2px 4px -1px rgba(16, 36, 58, 0.06), 0 4px 6px -1px rgba(16, 36, 58, 0.04)',
        'elevation': '0 10px 15px -3px rgba(16, 36, 58, 0.08), 0 4px 6px -2px rgba(16, 36, 58, 0.03)',
      }
    },
  },
  plugins: [tailwindcssAnimate],
}
