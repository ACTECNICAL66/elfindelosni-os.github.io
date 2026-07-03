/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                nasa: {
                    blue: '#0B3D91',
                    red: '#FC3D21',
                    dark: '#061528',
                    deep: '#0a1628',
                },
                water: {
                    50: '#edfcff',
                    100: '#d6f7ff',
                    200: '#b5f0ff',
                    300: '#83e8ff',
                    400: '#48d6ff',
                    500: '#1eb8ff',
                    600: '#069aff',
                    700: '#0082f0',
                    800: '#0868c2',
                    900: '#0d5898',
                },
                eco: {
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-in-left': 'slideInLeft 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.6s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient': 'gradient 8s ease infinite',
                'count-up': 'countUp 2s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(30, 184, 255, 0.2), 0 0 20px rgba(30, 184, 255, 0.1)' },
                    '100%': { boxShadow: '0 0 20px rgba(30, 184, 255, 0.4), 0 0 60px rgba(30, 184, 255, 0.2)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': 'linear-gradient(135deg, #0B3D91 0%, #061528 40%, #0a2b5c 70%, #0B3D91 100%)',
            },
        },
    },
    plugins: [],
}
