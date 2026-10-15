module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue:'#188AEF',
        blue01:'#0a2996',
        blue02:'#3F69FA',
        navy:'#182F43',
        ltblue:'#edf6fe',
        ltblue01:'#f3f7ff',
        grey:'#b4bfc9',
        orange:'#fb6c05',        
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'xss': ['0.75em', { lineHeight: '1rem' }],   // 12px
        'xs': ['0.8125rem', { lineHeight: '1.2rem' }],   // 13px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        '5xl': ['2.625rem', { lineHeight: '1' }],       // 42px
        '6xl': ['3rem', { lineHeight: '1' }],          // 48px
        '7xl': ['3.375rem', { lineHeight: '1' }],       // 54px
      },
      screens: {
        'max-xxl': { max: '1560px' },
        'max-xl': { max: '1280px' },
        'max-lg': { max: '1024px' },
        'max-md': { max: '768px' },
        'max-sm': { max: '640px' },
        'max-xs': { max: '480px' }
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
  darkMode: 'class'
};
