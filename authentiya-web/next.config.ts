/**
 * @file next.config.ts
 * @description This module defines and exports the Next.js configuration to be used during the
 *              build and runtime of the project.
 *
 * @author Ellia Morse
 * @created February 9th
 *
 * @preconditions
 * - Next.js must be installed in the project.
 * - The project must use ECMAScript modules (ESM).
 *
 * @inputs N/A
 * @outputs An exported Next.js configuration object.
 *
 * @postconditions
 * - The Next.js configuration is applied when building and running the project.
 *
 * @returns {NextConfig} nextConfig - A Next.js configuration object.
 *
 * @errors & Exceptions
 * - Next.js configuration errors may arise if invalid options are provided.
 *
 * @sideEffects N/A
 *
 * @invariants
 * - The Next.js configuration must be valid according to Next.js specifications.
 *
 * @knownFaults N/A
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = { // Importing the NextConfig type from Next.js to provide type safety for the configuration object.
  /* config options here */
};

export default nextConfig; // Exporting the Next.js configuration so it can be used by Next.js during the build and runtime.
