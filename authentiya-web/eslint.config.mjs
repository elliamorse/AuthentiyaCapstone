import { dirname } from "path"; // Importing 'dirname' to get the directory name of a file path
import { fileURLToPath } from "url"; // Importing 'fileURLToPath' to convert file URL to a file path
import { FlatCompat } from "@eslint/eslintrc"; // Importing FlatCompat for backward compatibility with ESLint's old config format

// Convert the current module URL to a file path
const __filename = fileURLToPath(import.meta.url); 
// Get the directory name of the current file
const __dirname = dirname(__filename);

// Create a FlatCompat instance to handle ESLint config compatibility
const compat = new FlatCompat({
  baseDirectory: __dirname, // Set the base directory for resolving configurations
});

// Define the ESLint configuration, extending recommended Next.js rules
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"), // Extend Next.js Core Web Vitals and TypeScript rules
];

export default eslintConfig; // Export the configuration for use in ESLint
