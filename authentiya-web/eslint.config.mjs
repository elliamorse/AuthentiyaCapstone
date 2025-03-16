/**
 * @file eslintConfig.js
 * @description This module defines and exports an ESLint configuration that extends
 *              the recommended Next.js Core Web Vitals and TypeScript rules.
 *
 * @author Ellia Morse
 * @created February 9th
 * @revised March 15th - Updated configuration compatibility by Deborah Onuosa
 *
 * @preconditions
 * - ESLint must be installed in the project.
 * - The @eslint/eslintrc package must be installed.
 * - The project must use ECMAScript modules (ESM).
 *
 * @inputs N/A
 * @outputs An exported ESLint configuration object.
 *
 * @postconditions
 * - The ESLint configuration is loaded and used by ESLint in the project.
 *
 * @returns {Array} eslintConfig - An array defining the ESLint configuration.
 *
 * @errors & Exceptions
 * - Import errors may occur if required modules are missing.
 * - Compatibility issues may arise if ESLint updates its configuration format.
 *
 * @sideEffects N/A
 *
 * @invariants
 * - The configuration must always extend the recommended Next.js rules.
 *
 * @knownFaults N/A
 */

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
