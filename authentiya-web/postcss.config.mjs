/**  
 * PostCSS Configuration for Authentiya Web  
 * This config enables PostCSS plugins, including Tailwind CSS for styling.  
 * It ensures that Tailwind processes styles correctly within the project.  
 *  
 * @type {import('postcss-load-config').Config} 
 */ 
const config = {
  plugins: {
    tailwindcss: {}, // Enables Tailwind CSS as a PostCSS plugin
  },
};

export default config;
