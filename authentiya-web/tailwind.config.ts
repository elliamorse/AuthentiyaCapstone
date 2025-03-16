/**
 * @file tailwind.config.ts
 * @description This module defines and exports the Tailwind CSS configuration for the project.
 *              It specifies which files Tailwind should scan for class names and extends the default theme 
 *              with custom colors using CSS variables for background and foreground.
 *
 * @author Ellia Morse
 * @created February 9th
 * @revised March 15th - Added detailed documentation by Deborah Onuosa
 *
 * @preconditions
 * - Tailwind CSS must be installed and configured in the project.
 * - The CSS variables '--background' and '--foreground' must be defined globally in the project.
 *
 * @inputs N/A
 * @outputs An exported Tailwind CSS configuration object.
 *
 * @postconditions
 * - The Tailwind CSS configuration is applied to the project, enabling styling based on the configuration.
 *
 * @returns {import('tailwindcss').Config} config - A Tailwind CSS configuration object.
 *
 * @errors & Exceptions
 * - If the file paths in the content array are incorrect or non-existent, Tailwind may not generate styles for those files.
 *
 * @sideEffects N/A
 *
 * @invariants
 * - The content array must always point to valid paths for Tailwind to generate styles.
 *
 * @knownFaults N/A
 */

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
