// =========================================
// Auth Module - Authentication Management
// =========================================

const Auth = {
  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  },

  // Get current user from storage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  },

  // Login
  async login(email, password) {
    try {
      const response = await API.auth.login(email, password);

      if (response.data?.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);

        // Fetch and store user profile
        await this.fetchProfile();

        return { success: true };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Register
  async register(email, password) {
    try {
      const response = await API.auth.register(email, password);

      if (response.data?.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        await this.fetchProfile();
        return { success: true };
      }

      // If no token returned, user needs to login
      return { success: true, needsLogin: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Fetch and store user profile
  async fetchProfile() {
    try {
      const response = await API.auth.getProfile();
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      this.logout();
    }
    return null;
  },

  // Logout
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  },

  // Require auth - redirect to login if not authenticated
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  // Redirect if already logged in
  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = '/';
      return true;
    }
    return false;
  },

  // Update UI with user info
  updateUI() {
    const user = this.getUser();

    // Update user name displays
    document.querySelectorAll('[data-user-name]').forEach((el) => {
      el.textContent = user?.email?.split('@')[0] || 'User';
    });

    // Update user email displays
    document.querySelectorAll('[data-user-email]').forEach((el) => {
      el.textContent = user?.email || '';
    });

    // Update user role displays
    document.querySelectorAll('[data-user-role]').forEach((el) => {
      el.textContent = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : '';
    });

    // Update avatar initials
    document.querySelectorAll('[data-user-avatar]').forEach((el) => {
      el.textContent = UI.getInitials(user?.email);
    });

    // Show/hide admin-only elements
    document.querySelectorAll('[data-admin-only]').forEach((el) => {
      el.style.display = this.isAdmin() ? '' : 'none';
    });

    // Show/hide elements based on auth state
    document.querySelectorAll('[data-auth-only]').forEach((el) => {
      el.style.display = this.isLoggedIn() ? '' : 'none';
    });

    document.querySelectorAll('[data-guest-only]').forEach((el) => {
      el.style.display = this.isLoggedIn() ? 'none' : '';
    });
  },
};

// Handle login form
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('[name="email"]').value.trim();
    const password = form.querySelector('[name="password"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorEl = form.querySelector('.form-error-message');

    // Clear previous error
    if (errorEl) errorEl.textContent = '';

    // Validate
    if (!email || !password) {
      if (errorEl) errorEl.textContent = 'Please fill in all fields';
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';

    const result = await Auth.login(email, password);

    if (result.success) {
      UI.toast.success('Welcome back!', 'Login successful');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } else {
      if (errorEl) errorEl.textContent = result.error;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

// Handle register form
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('[name="email"]').value.trim();
    const password = form.querySelector('[name="password"]').value;
    const confirmPassword = form.querySelector(
      '[name="confirmPassword"]',
    )?.value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorEl = form.querySelector('.form-error-message');

    // Clear previous error
    if (errorEl) errorEl.textContent = '';

    // Validate
    if (!email || !password) {
      if (errorEl) errorEl.textContent = 'Please fill in all fields';
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      if (errorEl) errorEl.textContent = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      if (errorEl)
        errorEl.textContent = 'Password must be at least 6 characters';
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';

    const result = await Auth.register(email, password);

    if (result.success) {
      if (result.needsLogin) {
        UI.toast.success(
          'Account created!',
          'Please sign in with your credentials',
        );
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
      } else {
        UI.toast.success('Welcome!', 'Account created successfully');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }
    } else {
      if (errorEl) errorEl.textContent = result.error;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
}

// Handle logout
function initLogout() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-logout]')) {
      e.preventDefault();
      Auth.logout();
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initRegisterForm();
  initLogout();
  Auth.updateUI();
});

// Export
window.Auth = Auth;
