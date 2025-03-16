/**
 * @file postcss.config.mjs
 * @description This module defines and exports the PostCSS configuration for the Authentiya Web project.
 *              It enables PostCSS plugins, including Tailwind CSS, to process styles correctly within the project.
 *
 * @author Ellia Morse
 * @created February 9th
 * @revised March 15th - Added detailed documentation by Deborah Onuosa
 *
 * @preconditions
 * - PostCSS must be installed in the project.
 * - Tailwind CSS must be installed as a dependency.
 * - The project must use ECMAScript modules (ESM).
 *
 * @inputs N/A
 * @outputs An exported PostCSS configuration object.
 *
 * @postconditions
 * - The PostCSS configuration is applied when processing styles in the project.
 *
 * @returns {import('postcss-load-config').Config} config - A PostCSS configuration object.
 *
 * @errors & Exceptions
 * - Configuration errors may occur if PostCSS or required plugins are missing.
 *
 * @sideEffects N/A
 *
 * @invariants
 * - The PostCSS configuration must always include Tailwind CSS as a plugin.
 *
 * @knownFaults N/A
 */
const config = {
  plugins: {
    tailwindcss: {}, // Enables Tailwind CSS as a PostCSS plugin
  },
};

export default config;
