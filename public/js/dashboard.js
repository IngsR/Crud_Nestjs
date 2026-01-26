// =========================================
// Dashboard Module - Dashboard & Sidebar
// =========================================

const Dashboard = {
  // Initialize dashboard
  init() {
    this.initSidebar();
    this.initMobileNav();
    this.loadStats();
    Auth.updateUI();
  },

  // Initialize sidebar
  initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    if (!sidebar || !toggleBtn) return;

    // Get saved state
    const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    }

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem(
        'sidebar_collapsed',
        sidebar.classList.contains('collapsed'),
      );
    });
  },

  // Initialize mobile navigation
  initMobileNav() {
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-overlay');

    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        sidebar?.classList.toggle('mobile-open');
        overlay?.classList.toggle('open');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar?.classList.remove('mobile-open');
        overlay.classList.remove('open');
      });
    }

    // Close on nav item click (mobile)
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          sidebar?.classList.remove('mobile-open');
          overlay?.classList.remove('open');
        }
      });
    });
  },

  // Load dashboard stats
  async loadStats() {
    const statsContainer = document.getElementById('dashboard-stats');
    if (!statsContainer) return;

    try {
      // Fetch products and categories counts
      const [productsRes, categoriesRes] = await Promise.all([
        API.products.getAll({ limit: 1 }),
        API.categories.getAll({ limit: 1 }),
      ]);

      const productsData = productsRes.data || productsRes;
      const categoriesData = categoriesRes.data || categoriesRes;

      const totalProducts =
        productsData.meta?.total ||
        (Array.isArray(productsData) ? productsData.length : 0);
      const totalCategories =
        categoriesData.meta?.total ||
        (Array.isArray(categoriesData) ? categoriesData.length : 0);

      // Update stats
      const productStat = document.getElementById('stat-products');
      const categoryStat = document.getElementById('stat-categories');

      if (productStat) productStat.textContent = totalProducts;
      if (categoryStat) categoryStat.textContent = totalCategories;
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  },

  // Load recent products
  async loadRecentProducts() {
    const container = document.getElementById('recent-products');
    if (!container) return;

    try {
      const response = await API.products.getAll({
        limit: 5,
        sortBy: 'createdAt',
        order: 'DESC',
      });
      const data = response.data || response;
      const products = data.data || data.items || data;

      if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML =
          '<p class="text-muted text-center">No products yet</p>';
        return;
      }

      container.innerHTML = products
        .map(
          (product) => `
        <a href="/products.html" class="flex items-center gap-3 mb-3 hover-bg p-2 rounded" style="text-decoration: none; color: inherit;">
          <div class="avatar avatar-sm">
            ${product.name.charAt(0).toUpperCase()}
          </div>
          <div class="flex-1 truncate">
            <div class="font-medium text-sm">${UI.escapeHtml(product.name)}</div>
            <div class="text-xs text-muted">${UI.formatCurrency(product.price)}</div>
          </div>
        </a>
      `,
        )
        .join('');
    } catch (error) {
      console.error('Failed to load recent products:', error);
    }
  },
};

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('sidebar')) {
    Dashboard.init();
  }
});

// Export
window.Dashboard = Dashboard;
