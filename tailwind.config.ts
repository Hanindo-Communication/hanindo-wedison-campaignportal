import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#0891B2',
        'secondary-teal': '#06B6D4',
        'accent-orange': '#F97316',
        'success-green': '#22C55E',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0891B2, #06B6D4)',
        'gradient-accent': 'linear-gradient(135deg, #F97316, #FB923C)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        /** Strip gambar */
        marquee: 'marquee 60s linear infinite',
        /** Strip teks — durasi beda supaya tidak “nempel” dengan strip gambar */
        'marquee-text': 'marquee 78s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
