import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "verde-neon": "var(--verde-neon)",
        "verde-acao": "var(--verde-acao)",
        "verde-carvao": "var(--verde-carvao)",
        "verde-carvao-escuro": "var(--verde-carvao-escuro)",
        "verde-carvao-claro": "var(--verde-carvao-claro)",
        preto: "var(--preto)",
        "cinza-900": "var(--cinza-900)",
        "cinza-500": "var(--cinza-500)",
        "cinza-200": "var(--cinza-200)",
        branco: "var(--branco)",
        lilas: "var(--lilas)",
        "lilas-claro": "var(--lilas-claro)",
        "lilas-escuro": "var(--lilas-escuro)",
        "fundo-pagina": "var(--fundo-pagina)",
        "texto-secundario": "var(--texto-secundario)",
        "ambar-claro": "var(--ambar-claro)",
        ambar: "var(--ambar)",
        "ambar-escuro": "var(--ambar-escuro)",
        "status-negociacao": "var(--status-negociacao)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
    },
  },
};

export default config;
