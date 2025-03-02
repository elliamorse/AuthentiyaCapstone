import type { Config } from "tailwindcss"; // Import the type definition for Tailwind CSS configuration

export default { // Export the Tailwind CSS configuration object
  content: [ // Specify the files that Tailwind should scan for class names
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Scan all JS, TS, JSX, TSX, and MDX files in the pages directory
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scan all JS, TS, JSX, TSX, and MDX files in the components directory
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Scan all JS, TS, JSX, TSX, and MDX files in the app directory
  ],
  theme: {
    extend: { 
       // Extend the default theme with custom colors
      colors: {
        background: "var(--background)", // Use the --background CSS variable for the background color
        foreground: "var(--foreground)", // Use the --foreground CSS variable for the foreground color
      },
    },
  },
  plugins: [], // No plugins are added to the Tailwind CSS configuration
} satisfies Config; // Ensure the configuration satisfies the Tailwind CSS Config type
