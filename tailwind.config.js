/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 三色団子テーマ
        dango: {
          // ピンク (桜色)
          pink: {
            50: '#fef7f7',
            100: '#fdedee',  
            200: '#fbdade',
            300: '#f7bcc1',
            400: '#f194a1',
            500: '#e96d81',  // メインピンク
            600: '#d94570',
            700: '#c1345d',
            800: '#a02c54',
            900: '#86284d',
          },
          // 黄緑 (抹茶色)
          green: {
            50: '#f6fbf6',
            100: '#e9f6ea',
            200: '#d4ecd6',
            300: '#b0dbb5',
            400: '#84c28c',
            500: '#5fa768',  // メイン黄緑
            600: '#4a8c52',
            700: '#3d7043',
            800: '#345a38',
            900: '#2d4b30',
          },
          // 白 (クリーム色)
          cream: {
            50: '#fffffe',
            100: '#fffdf8',
            200: '#fffbf0',
            300: '#fff8e1',
            400: '#fff2c7',
            500: '#ffeaa0',  // メインクリーム
            600: '#f5d96b',
            700: '#e8c547',
            800: '#d4a829',
            900: '#b8901a',
          }
        }
      },
    },
  },
  plugins: [],
}