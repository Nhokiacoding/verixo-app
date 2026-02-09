// Router utility functions for navigation
// This provides a centralized way to handle navigation throughout the app
// Note: For React Router apps, prefer using useNavigate hook in components

/**
 * Navigate to a specific route
 * This is a fallback for non-component contexts
 * @param {string} path - The path to navigate to
 * @param {object} options - Navigation options
 */
export const navigateTo = (path, options = {}) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Simple navigation using window.location
  // Note: This will cause a full page reload, not SPA navigation
  if (options.replace) {
    window.location.replace(path);
  } else {
    window.location.href = path;
  }
};

/**
 * Go back in browser history
 */
export const goBack = () => {
  window.history.back();
};

/**
 * Go forward in browser history
 */
export const goForward = () => {
  window.history.forward();
};

/**
 * Replace current URL without navigation
 * @param {string} path - The new path
 */
export const replaceUrl = (path) => {
  window.history.replaceState({}, '', path);
};

/**
 * Push new URL to history without navigation
 * @param {string} path - The new path
 */
export const pushUrl = (path) => {
  window.history.pushState({}, '', path);
};

export default {
  navigateTo,
  goBack,
  goForward,
  replaceUrl,
  pushUrl
};
