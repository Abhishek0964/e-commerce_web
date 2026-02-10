import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            // Amazon-inspired color palette
            colors: {
                // Core Amazon palette
                background: '#FFFFFF',
                foreground: '#0F1111',

                // Amazon's signature orange/amber
                primary: {
                    DEFAULT: '#FF9900',
                    50: '#FFF8E7',
                    100: '#FFEFC2',
                    200: '#FFE49B',
                    300: '#FFD56B',
                    400: '#FFCA46',
                    500: '#FF9900',
                    600: '#E88B00',
                    700: '#CC7A00',
                    800: '#A36200',
                    900: '#7A4900',
                    foreground: '#0F1111',
                },

                // Amazon dark navy
                secondary: {
                    DEFAULT: '#232F3E',
                    50: '#F0F2F4',
                    100: '#D5DBE1',
                    200: '#AAB7C4',
                    300: '#7F93A7',
                    400: '#546F8A',
                    500: '#37475A',
                    600: '#232F3E',
                    700: '#1A2530',
                    800: '#131A21',
                    900: '#0A0F14',
                    foreground: '#FFFFFF',
                },

                // Accent - Amazon teal/deal blue
                accent: {
                    DEFAULT: '#007185',
                    50: '#E0F7FA',
                    100: '#B2EBF2',
                    200: '#80DEEA',
                    300: '#4DD0E1',
                    400: '#26C6DA',
                    500: '#007185',
                    600: '#005F6B',
                    700: '#004D55',
                    800: '#003A40',
                    900: '#00272C',
                    foreground: '#FFFFFF',
                },

                // Functional colors
                border: '#DDD',
                input: '#DDD',
                ring: '#FF9900',

                destructive: {
                    DEFAULT: '#B12704',
                    foreground: '#FFFFFF',
                },

                muted: {
                    DEFAULT: '#F7F8F8',
                    foreground: '#565959',
                },

                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#0F1111',
                },

                popover: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#0F1111',
                },

                // Amazon-specific utility colors
                deal: '#CC0C39',
                success: '#067D62',
                warning: '#F5A623',
                info: '#007185',
                star: '#FFA41C',
            },

            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },

            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },

            // Enhanced animations
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(255, 153, 0, 0.2)' },
                    '50%': { boxShadow: '0 0 20px rgba(255, 153, 0, 0.4), 0 0 40px rgba(255, 153, 0, 0.1)' },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite',
            },

            backgroundImage: {
                'gradient-amazon': 'linear-gradient(to bottom, #232F3E 0%, #37475A 100%)',
                'gradient-deal': 'linear-gradient(135deg, #CC0C39 0%, #FF6B35 100%)',
                'gradient-cta': 'linear-gradient(180deg, #FFD814 0%, #FF9900 100%)',
            },

            boxShadow: {
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12), 0 0 20px rgba(255, 153, 0, 0.15)',
                'amazon': '0 2px 5px 0 rgba(213, 217, 217, 0.5)',
                'amazon-hover': '0 0 3px 2px rgba(228, 121, 17, 0.5)',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
