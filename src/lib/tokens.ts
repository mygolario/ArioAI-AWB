import type { DesignTokens } from "./types";

export const tokens: DesignTokens = {
  colors: {
    primary: "#f59e0b", // amber-500 - warm primary
    secondary: "#d97706", // amber-600 - warm secondary
    background: "#fffbeb", // amber-50 - very light warm background
    surface: "#fef3c7", // amber-100 - light warm surface
    border: "#fde68a", // amber-200 - light warm border
    text: "#78350f", // amber-900 - dark warm text
    textSecondary: "#92400e", // amber-800 - medium warm text
    accent1: "#fbbf24", // amber-400 - bright warm accent
    accent2: "#f97316", // orange-500 - warm orange accent
  },
  fonts: {
    heading: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
  },
  radius: "0.5rem",
  shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
};

