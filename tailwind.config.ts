import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "verde-neon": "var(--verde-neon)",
        "verde-acao": "var(--verde-acao)",
        preto: "var(--preto)",
        "cinza-900": "var(--cinza-900)",
        "cinza-500": "var(--cinza-500)",
        "cinza-200": "var(--cinza-200)",
        branco: "var(--branco)",
        "status-negociacao": "var(--status-negociacao)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
    },
  },
};

export default config;
