import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Professional E-commerce Color Scheme 2026
                // Soft neutrals for trust and readability
                background: '#F8FAFC', // Soft gray-blue background
                foreground: '#1E293B', // Deep slate for text
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#1E293B'
                },
                popover: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#1E293B'
                },
                // Primary: Confident blue with gradient capability
                primary: {
                    DEFAULT: '#3B82F6', // Vibrant blue
                    foreground: '#FFFFFF',
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A'
                },
                // Secondary/Accent: Success green for CTAs and trust signals
                secondary: {
                    DEFAULT: '#10B981', // Emerald green
                    foreground: '#FFFFFF',
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    400: '#34D399',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B'
                },
                muted: {
                    DEFAULT: '#F1F5F9', // Light slate
                    foreground: '#64748B' // Muted slate text
                },
                accent: {
                    DEFAULT: '#F59E0B', // Accent orange for urgency/sales
                    foreground: '#FFFFFF'
                },
                destructive: {
                    DEFAULT: '#EF4444', // Red for errors
                    foreground: '#FFFFFF'
                },
                border: '#E2E8F0', // Light border
                input: '#E2E8F0',
                ring: '#3B82F6', // Focus ring matches primary
                chart: {
                    '1': '#3B82F6',
                    '2': '#10B981',
                    '3': '#F59E0B',
                    '4': '#8B5CF6',
                    '5': '#EC4899'
                }
            },
            borderRadius: {
                lg: '0.75rem', // More modern rounded corners
                md: '0.5rem',
                sm: '0.375rem'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
                'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                'gradient-subtle': 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)'
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'slide-in-left': 'slideInLeft 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient-x': 'gradientX 3s ease infinite',
                'gradient-y': 'gradientY 3s ease infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': {
                        opacity: '0'
                    },
                    '100%': {
                        opacity: '1'
                    }
                },
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                scaleIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.9)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1)'
                    }
                },
                slideInRight: {
                    '0%': {
                        transform: 'translateX(100%)'
                    },
                    '100%': {
                        transform: 'translateX(0)'
                    }
                },
                slideInLeft: {
                    '0%': {
                        transform: 'translateX(-100%)'
                    },
                    '100%': {
                        transform: 'translateX(0)'
                    }
                },
                gradientX: {
                    '0%, 100%': {
                        'background-position': '0% 50%'
                    },
                    '50%': {
                        'background-position': '100% 50%'
                    }
                },
                gradientY: {
                    '0%, 100%': {
                        'background-position': '50% 0%'
                    },
                    '50%': {
                        'background-position': '50% 100%'
                    }
                }
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
