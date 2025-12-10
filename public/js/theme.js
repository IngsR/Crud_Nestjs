// =========================================
// Theme Manager - Dark/Light Mode
// =========================================

const Theme = {
  STORAGE_KEY: 'theme',

  // Initialize theme
  init() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.apply(theme);

    // Listen for system theme changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.apply(e.matches ? 'dark' : 'light');
        }
      });

    // Setup toggle buttons
    this.setupToggle();
  },

  // Apply theme
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcons(theme);
  },

  // Toggle theme
  toggle() {
    const currentTheme =
      document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    localStorage.setItem(this.STORAGE_KEY, newTheme);
    this.apply(newTheme);

    return newTheme;
  },

  // Get current theme
  get() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  },

  // Update theme icons
  updateIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach((btn) => {
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');

      if (sunIcon) sunIcon.style.display = theme === 'light' ? 'block' : 'none';
      if (moonIcon)
        moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
    });
  },

  // Setup toggle button listeners
  setupToggle() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.theme-toggle');
      if (toggle) {
        this.toggle();
      }
    });
  },
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
});

// Export
window.Theme = Theme;
