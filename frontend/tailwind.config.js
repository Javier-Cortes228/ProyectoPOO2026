/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'], // Reemplazamos orbitron por outfit
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                background: '#0F172A',
                surface: '#1E293B',
                hover: '#334155',
                primary: '#3a89ff', // Tu azul base
                secondary: '#22D3EE', // Tu celeste secundario
                textMain: '#F8FAFC',
                textSub: '#94A3B8'
            },
            borderRadius: {
                'xl': '16px',
                '2xl': '24px',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
                'glow': '0 0 15px rgba(58, 137, 255, 0.4)',
            }
        },
    },
    plugins: [],
}