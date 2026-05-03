/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f7f8f5",
        ink: "#121512",
        muted: "#5d655e",
        line: "#d9ded6",
        panel: "#ffffff",
        "panel-muted": "#eef1ea",
        primary: "#09a66d",
        "primary-ink": "#053f2b",
        support: "#2357ff",
        warning: "#c87900",
        danger: "#b42318",
        profit: "#087f5b",
        loss: "#c92a2a"
      },
      boxShadow: {
        panel: "0 18px 55px rgba(18, 21, 18, 0.08)",
        lift: "0 12px 35px rgba(18, 21, 18, 0.11)"
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace"
        ]
      }
    }
  },
  plugins: []
};

