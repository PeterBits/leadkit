/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Priority colors - borders
    'border-l-gray-400',
    'border-l-blue-400',
    'border-l-green-400',
    'border-l-yellow-400',
    'border-l-orange-400',
    'border-l-red-400',
    'border-l-purple-400',
    'border-l-pink-400',
    'border-l-gray-300',
    // Priority colors - solid backgrounds (for badges)
    'bg-gray-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-yellow-400',
    'bg-orange-400',
    'bg-red-400',
    'bg-purple-400',
    'bg-pink-400',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
