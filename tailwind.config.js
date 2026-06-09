/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Production optimizations - safelist specific classes actually used
  safelist: [
    // Spectra brand colors
    'spectra-blue',
    'spectra-green',
    'spectra-purple',
    'spectra-cyan',
    'spectra-yellow',
    // Keep animation classes
    'animate-pulse',
    'animate-ping',
    'animate-bounce',
    'animate-fade-in',
    'animate-fade-in-up',
    'animate-fade-in-down',
    'animate-slide-in-left',
    'animate-slide-in-right',
    'animate-gradient',
    'animate-float',
    'animate-glow',
    'animate-shimmer',
    'animate-pulse-glow',
    'animate-success-pulse',
    'animate-slide-up',
    'animate-scale-in',
    'animate-pulse-neon',
    // Keep essential utility classes that might be generated dynamically
    'bg-black/60',
    'bg-blue-500/20',
    'bg-blue-500/30',
    'bg-neutral-800/50',
    'bg-neutral-700/50',
    'bg-gradient-to-br',
    'bg-gradient-to-t',
    'from-black',
    'from-neutral-800',
    'via-neutral-700',
    'to-neutral-800',
    'to-transparent',
    // Common hover states that might be applied dynamically
    'hover:bg-blue-500/30',
    'hover:text-blue-400',
    'transition-colors',
    'transition-opacity',
    // Text colors for dynamic content
    'text-neutral-400',
    'text-red-400',
    'text-blue-400',
    'text-white',
    'text-xs',
    'text-sm',
    // Border utilities
    'border',
    'border-neutral-700',
    'border-neutral-700/50',
    'border-lg',
    'rounded',
    'rounded-lg',
    // Opacity and transition classes
    'opacity-0',
    'opacity-100',
    'duration-300',
    // Size classes
    'w-full',
    'h-full',
    'inset-0',
    'absolute',
    'relative',
    'overflow-hidden',
    'flex',
    'items-center',
    'justify-center',
    'flex-col',
    'p-2',
    'px-3',
    'py-1',
    'mb-2',
    'mb-4',
    // Loading and error specific classes
    'bg-gradient-to-br',
    'from-neutral-800',
    'via-neutral-700',
    'to-neutral-800',
    // New gradient classes
    'bg-gradient-cta',
    'bg-gradient-spectra',
    'bg-gradient-spectra-subtle',
    'bg-gradient-hero',
    'bg-gradient-hero-dark',
    'bg-gradient-card',
    'bg-gradient-holo',
    'bg-gradient-shield-green',
    'bg-gradient-shield-blue',
    // Shadow classes
    'shadow-glow-spectra',
    'shadow-glow-spectra-lg',
    'shadow-glow-green',
    'shadow-glow-green-lg',
    'shadow-neon',
    'shadow-neon-green',
    'shadow-card-hover',
    'shadow-cta-primary',
    'shadow-cta-primary-hover',
    // Audit-fever utility classes (defined in globals.css)
    'neon-text',
    'neon-glow',
    'holographic-card',
  ],
  theme: {
    extend: {
      colors: {
        // Spectra Brand Colors - distinctive, professional palette
        spectra: {
          blue: {
            // Audit-fever azure — bright, neon-leaning cyan-blue (~hsl(202 100% 50%)).
            // Brighter than the old #0066FF so glows read as the audit-fever cyan.
            50: '#E6F4FF',
            100: '#BDE4FF',
            200: '#85CEFF',
            300: '#4DB8FF',
            400: '#1AA3FF',
            500: '#0099FF',  // Primary brand color - neon azure
            600: '#007ACC',
            700: '#005C99',
            800: '#003D66',
            900: '#001F33',
            950: '#00111F',
          },
          green: {
            50: '#E6FFF5',
            100: '#B3FFE6',
            200: '#80FFD7',
            300: '#4DFFC7',
            400: '#1AFFB8',
            500: '#00D084',  // Security green - safety, verification
            600: '#00A86B',
            700: '#008052',
            800: '#005839',
            900: '#003020',
            950: '#001a10',
          },
          purple: {
            50: '#EEF2FF',
            100: '#E0E7FF',
            200: '#C7D2FE',
            300: '#A5B4FC',
            400: '#818CF8',
            500: '#6366F1',  // Accent purple - innovation
            600: '#4F46E5',
            700: '#4338CA',
            800: '#3730A3',
            900: '#312E81',
            950: '#1e1b4b',
          },
          cyan: {
            50: '#E0FBFF',
            100: '#B3F3FF',
            200: '#80EAFF',
            300: '#4DE0FF',
            400: '#1AD4FF',
            500: '#06B6D4',  // Tech cyan - retraining / intelligence
            600: '#0496B0',
            700: '#03738A',
            800: '#025463',
            900: '#01323B',
            950: '#001A1F',
          },
          yellow: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',  // Caution / evaluation - reputation, judgment
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
            950: '#451A03',
          }
        },
        // Semantic Colors - consistent meaning across the app
        success: {
          primary: '#00D084',
          secondary: '#33E6A8',
          bg: 'rgba(0, 208, 132, 0.1)',
          border: 'rgba(0, 208, 132, 0.3)',
        },
        warning: {
          primary: '#F59E0B',
          secondary: '#FBBF24',
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.3)',
        },
        error: {
          primary: '#EF4444',
          secondary: '#F87171',
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
        },
        info: {
          primary: '#3B82F6',
          secondary: '#60A5FA',
          bg: 'rgba(59, 130, 246, 0.1)',
          border: 'rgba(59, 130, 246, 0.3)',
        },
        // Keep existing colors for backward compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        security: {
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Audit-fever near-black dark surfaces — deep blue-black so the cyan
        // ambient glow + neon accents pop the way they do on audit-fever.
        ink: {
          950: '#070B14',  // page background (near-black navy)
          900: '#0A1020',  // raised / alternating sections
          850: '#0E1626',  // card surface
          800: '#13203A',  // hovered card / inset
        }
      },
      // Enhanced gradient system
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // New Spectra gradients — azure-led to match audit-fever's neon cyan
        'gradient-spectra': 'linear-gradient(135deg, #0099FF 0%, #00C2FF 45%, #00D084 100%)',
        'gradient-spectra-subtle': 'linear-gradient(135deg, rgba(0, 153, 255, 0.12) 0%, rgba(0, 194, 255, 0.05) 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.02) 50%, rgba(15, 23, 42, 0) 100%)',
        'gradient-hero-dark': 'linear-gradient(180deg, #070B14 0%, #0A1020 50%, #070B14 100%)',
        // Holographic dark card — audit-fever "FUT card" surface
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'gradient-holo': 'linear-gradient(135deg, rgba(0,153,255,0.10) 0%, rgba(14,22,38,0.6) 45%, rgba(0,208,132,0.06) 100%)',
        'gradient-cta': 'linear-gradient(135deg, #0099FF 0%, #00C8B4 100%)',
        'gradient-shield-green': 'linear-gradient(135deg, #00D084, #00A86B)',
        'gradient-shield-blue': 'linear-gradient(135deg, #0099FF, #007ACC)',
        // Legacy gradients (keep for backward compatibility)
        'gradient-spectra-old': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hero-gradient': 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      },
      // Enhanced shadow system
      boxShadow: {
        'glow': '0 0 20px rgba(0, 153, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 153, 255, 0.3)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
        // New Spectra shadows — azure neon to match audit-fever
        'glow-spectra': '0 0 20px rgba(0, 153, 255, 0.5)',
        'glow-spectra-lg': '0 0 40px rgba(0, 153, 255, 0.3)',
        'glow-green': '0 0 20px rgba(0, 208, 132, 0.5)',
        'glow-green-lg': '0 0 40px rgba(0, 208, 132, 0.3)',
        // Layered neon halo (audit-fever .neon-glow look)
        'neon': '0 0 12px rgba(0,153,255,0.35), 0 0 28px rgba(0,153,255,0.20), 0 0 48px rgba(0,153,255,0.10)',
        'neon-green': '0 0 12px rgba(0,208,132,0.35), 0 0 28px rgba(0,208,132,0.18)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.45)',
        'cta-primary': '0 4px 12px rgba(0, 153, 255, 0.4)',
        'cta-primary-hover': '0 8px 24px rgba(0, 153, 255, 0.55)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['SF Pro Display', 'Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Enhanced animation system
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        // New Spectra animations
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'pulse-neon': 'pulseNeon 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'success-pulse': 'successPulse 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        // New Spectra keyframes
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        // Breathing neon halo for the primary CTA (audit-fever pulse-neon)
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,153,255,0.45), 0 0 0 rgba(0,153,255,0)' },
          '50%': { boxShadow: '0 0 18px rgba(0,153,255,0.85), 0 0 36px rgba(0,153,255,0.4), 0 0 56px rgba(0,153,255,0.2)' },
        },
        successPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
