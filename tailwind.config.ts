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
        /** Wedison corporate — wordmark & headings */
        'wedison-navy': '#1A365D',
        /** Light badge backgrounds (Supercharge App style) */
        'wedison-mint': '#E8F5E9',
        /**
         * Primary CTA / links — name kept as `electric-blue` for backward compatibility
         * with existing class names across the repo.
         */
        'electric-blue': '#1B8C5A',
        'electric-blue-dark': '#146b47',
        /** Secondary accent green (lighter) */
        'secondary-teal': '#36B37E',
        'accent-orange': '#F97316',
        /** WhatsApp / positive actions */
        'success-green': '#22C55E',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1B8C5A, #36B37E)',
        'gradient-accent': 'linear-gradient(135deg, #F97316, #FB923C)',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
