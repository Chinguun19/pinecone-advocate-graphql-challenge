/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pinecone-purple': 'rgb(107, 70, 193)',
        'pinecone-green': 'rgb(34, 197, 94)',
        'pinecone-accent': 'rgb(59, 130, 246)',
      },
    },
  },
  plugins: [],
} 