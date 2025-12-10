// =========================================
// UI Components - Reusable UI Elements
// =========================================

const UI = {
  // Toast notifications
  toast: {
    container: null,

    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },

    show(type, title, message, duration = 5000) {
      this.init();

      const icons = {
        success:
          '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error:
          '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning:
          '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      };

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        ${icons[type] || icons.info}
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="toast-close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;

      // Close button handler
      toast.querySelector('.toast-close').addEventListener('click', () => {
        this.hide(toast);
      });

      this.container.appendChild(toast);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => this.hide(toast), duration);
      }

      return toast;
    },

    hide(toast) {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    },

    success(title, message) {
      return this.show('success', title, message);
    },

    error(title, message) {
      return this.show('error', title, message);
    },

    warning(title, message) {
      return this.show('warning', title, message);
    },

    info(title, message) {
      return this.show('info', title, message);
    },
  },

  // Modal dialogs
  modal: {
    open(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    },

    close(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    },

    closeAll() {
      document.querySelectorAll('.modal-overlay.open').forEach((modal) => {
        modal.classList.remove('open');
      });
      document.body.style.overflow = '';
    },

    // Initialize modal event listeners
    init() {
      // Close on overlay click
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
          e.target.classList.remove('open');
          document.body.style.overflow = '';
        }
      });

      // Close on close button click
      document.addEventListener('click', (e) => {
        if (e.target.closest('.modal-close')) {
          const modal = e.target.closest('.modal-overlay');
          if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
          }
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAll();
        }
      });
    },
  },

  // Confirm dialog
  confirm: {
    show(options = {}) {
      return new Promise((resolve) => {
        const {
          title = 'Are you sure?',
          message = 'This action cannot be undone.',
          confirmText = 'Confirm',
          cancelText = 'Cancel',
          type = 'danger',
        } = options;

        const icons = {
          danger:
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
          warning:
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
          info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        };

        // Create modal
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay open';
        overlay.innerHTML = `
          <div class="modal" style="max-width: 400px;">
            <div class="modal-body">
              <div class="confirm-dialog">
                <div class="confirm-icon">${icons[type] || icons.danger}</div>
                <h3 class="confirm-title">${title}</h3>
                <p class="confirm-message">${message}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary cancel-btn">${cancelText}</button>
              <button class="btn btn-${type} confirm-btn">${confirmText}</button>
            </div>
          </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Event handlers
        const cleanup = () => {
          overlay.classList.remove('open');
          document.body.style.overflow = '';
          setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.cancel-btn').addEventListener('click', () => {
          cleanup();
          resolve(false);
        });

        overlay.querySelector('.confirm-btn').addEventListener('click', () => {
          cleanup();
          resolve(true);
        });

        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            cleanup();
            resolve(false);
          }
        });
      });
    },
  },

  // Loading overlay
  loading: {
    overlay: null,

    show() {
      if (!this.overlay) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = '<div class="loading-spinner"></div>';
      }
      document.body.appendChild(this.overlay);
    },

    hide() {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.remove();
      }
    },
  },

  // Dropdown menus
  dropdown: {
    init() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-dropdown]');

        if (trigger) {
          const dropdown = trigger.closest('.dropdown');
          const isOpen = dropdown.classList.contains('open');

          // Close all dropdowns first
          document.querySelectorAll('.dropdown.open').forEach((d) => {
            d.classList.remove('open');
          });

          // Toggle current dropdown
          if (!isOpen) {
            dropdown.classList.add('open');
          }
          return;
        }

        // Close all dropdowns when clicking outside
        if (!e.target.closest('.dropdown')) {
          document.querySelectorAll('.dropdown.open').forEach((d) => {
            d.classList.remove('open');
          });
        }
      });
    },
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Format date
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Format date time
  formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Get initials from name/email
  getInitials(text) {
    if (!text) return '?';
    const parts = text.replace(/@.*$/, '').split(/[\s._-]+/);
    return parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  },

  // Escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Initialize all UI components
  init() {
    this.modal.init();
    this.dropdown.init();
  },
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});

// Export
window.UI = UI;
