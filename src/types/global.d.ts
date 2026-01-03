/**
 * Global type declarations for development utilities
 * exposed on the window object
 */

declare global {
  interface Window {
    /**
     * Opens the onboarding modal for development/demo purposes.
     * Can be called from the browser console: showOnboarding()
     */
    showOnboarding?: () => void;
  }
}

export {};
