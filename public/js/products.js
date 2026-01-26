// =========================================
// Products Module - Products Management
// =========================================

const Products = {
  currentPage: 1,
  totalPages: 1,
  limit: 12,
  filters: {},

  // Initialize products page
  async init() {
    this.bindEvents();
    await this.loadCategories();
    await this.load();
  },

  // Bind event listeners
  bindEvents() {
    // Search input
    const searchInput = document.getElementById('products-search');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.filters.search = e.target.value;
          this.currentPage = 1;
          this.load();
        }, 300);
      });
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.filters.category = e.target.value;
        this.currentPage = 1;
        this.load();
      });
    }

    // Sort by
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        const [sortBy, order] = e.target.value.split('-');
        this.filters.sortBy = sortBy;
        this.filters.order = order.toUpperCase();
        this.load();
      });
    }

    // Create product button
    document
      .querySelectorAll('[data-action="create-product"]')
      .forEach((btn) => {
        btn.addEventListener('click', () => this.openModal());
      });

    // View product button delegate
    document.addEventListener('click', async (e) => {
      const viewBtn = e.target.closest('[data-action="view-product"]');
      if (viewBtn) {
        const id = viewBtn.dataset.id;
        await this.showDetails(id);
      }
    });

    // Product form submit
    const form = document.getElementById('product-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Event delegation for edit/delete buttons
    document.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('[data-action="edit-product"]');
      const deleteBtn = e.target.closest('[data-action="delete-product"]');

      if (editBtn) {
        const id = editBtn.dataset.id;
        await this.openModal(id);
      }

      if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        await this.handleDelete(id);
      }
    });
  },

  // Load categories for filter
  async loadCategories() {
    try {
      const response = await API.categories.getAll();
      const categories = response.data || response;
      const filterSelect = document.getElementById('category-filter');
      const formSelect = document.getElementById('product-category');

      if (filterSelect && Array.isArray(categories)) {
        categories.forEach((cat) => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.name;
          filterSelect.appendChild(option);
        });
      }

      if (formSelect && Array.isArray(categories)) {
        formSelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach((cat) => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.name;
          formSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  },

  // Load products
  async load() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
      // Show loading state
      container.innerHTML = this.renderSkeleton();

      const params = {
        page: this.currentPage,
        limit: this.limit,
        ...this.filters,
      };

      const response = await API.products.getAll(params);
      const data = response.data || response;

      const products = data.data || data.items || data;
      const meta = data.meta || {};

      this.totalPages =
        meta.totalPages ||
        Math.ceil((meta.total || products.length) / this.limit);

      if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = this.renderEmpty();
        this.renderPagination();
        return;
      }

      container.innerHTML = products
        .map((product) => this.renderCard(product))
        .join('');
      this.renderPagination();
    } catch (error) {
      console.error('Failed to load products:', error);
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h3 class="empty-state-title">Error loading products</h3>
          <p class="empty-state-description">${error.message}</p>
          <button class="btn btn-primary" onclick="Products.load()">Try Again</button>
        </div>
      `;
    }
  },

  // Render product card
  renderCard(product) {
    const isAdmin = Auth.isAdmin();
    return `
    return `
      <div class="product-card">
        <div class="product-card-image">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          ${
            !product.isActive
              ? '<span class="status-badge inactive">Inactive</span>'
              : ''
          }
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${UI.escapeHtml(product.category?.name || 'Uncategorized')}</span>
          <h3 class="product-card-name">${UI.escapeHtml(product.name)}</h3>
          <p class="product-card-description">${UI.escapeHtml(product.description || 'No description')}</p>
        </div>
        <div class="product-card-footer">
          <div>
            <div class="product-card-price">${UI.formatCurrency(product.price)}</div>
            <div class="product-card-stock">Stock: ${product.stock}</div>
          </div>
          <div class="product-card-actions">
            <button class="btn btn-ghost btn-icon" data-action="view-product" data-id="${product.id}" title="View Details">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                 <circle cx="12" cy="12" r="3"/>
               </svg>
            </button>
            ${
              isAdmin
                ? `
              <button class="btn btn-ghost btn-icon" data-action="edit-product" data-id="${product.id}" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn btn-ghost btn-icon text-danger" data-action="delete-product" data-id="${product.id}" title="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;
  },

  // Render loading skeleton
  renderSkeleton() {
    return Array(6)
      .fill(
        `
      <div class="product-card">
        <div class="skeleton skeleton-card" style="aspect-ratio: 4/3;"></div>
        <div class="product-card-body">
          <div class="skeleton skeleton-text" style="width: 60px;"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text" style="width: 80%;"></div>
        </div>
        <div class="product-card-footer">
          <div class="skeleton skeleton-text" style="width: 80px;"></div>
        </div>
      </div>
    `,
      )
      .join('');
  },

  // Render empty state
  renderEmpty() {
    return `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
        </svg>
        <h3 class="empty-state-title">No products found</h3>
        <p class="empty-state-description">Try adjusting your search or filters to find what you're looking for.</p>
        ${Auth.isAdmin() ? `<button class="btn btn-primary" data-action="create-product">Add Product</button>` : ''}
      </div>
    `;
  },

  // Render pagination
  renderPagination() {
    const container = document.getElementById('products-pagination');
    if (!container) return;

    if (this.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = `
      <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="Products.goToPage(${this.currentPage - 1})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
    `;

    for (let i = 1; i <= this.totalPages; i++) {
      if (
        i === 1 ||
        i === this.totalPages ||
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="Products.goToPage(${i})">${i}</button>`;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += `<span class="pagination-info">...</span>`;
      }
    }

    html += `
      <button class="pagination-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''} onclick="Products.goToPage(${this.currentPage + 1})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    `;

    container.innerHTML = html;
  },

  // Go to page
  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Open create/edit modal
  async openModal(id = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('product-modal-title');

    if (!modal || !form) return;

    // Reset form
    form.reset();
    form.dataset.id = id || '';

    if (id) {
      title.textContent = 'Edit Product';
      try {
        UI.loading.show();
        const response = await API.products.getOne(id);
        const product = response.data || response;

        form.querySelector('[name="name"]').value = product.name || '';
        form.querySelector('[name="description"]').value =
          product.description || '';
        form.querySelector('[name="price"]').value = product.price || '';
        form.querySelector('[name="stock"]').value = product.stock || 0;
        form.querySelector('[name="categoryId"]').value =
          product.categoryId || '';
        if (form.querySelector('[name="isActive"]')) {
          form.querySelector('[name="isActive"]').checked =
            product.isActive !== false;
        }
      } catch (error) {
        UI.toast.error('Error', 'Failed to load product details');
        return;
      } finally {
        UI.loading.hide();
      }
    } else {
      title.textContent = 'Add Product';
    }

    UI.modal.open('product-modal');
  },

  // Handle form submit
  async handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const id = form.dataset.id;
    const submitBtn = form.querySelector('button[type="submit"]');

    const data = {
      name: form.querySelector('[name="name"]').value.trim(),
      description: form.querySelector('[name="description"]').value.trim(),
      price: parseFloat(form.querySelector('[name="price"]').value),
      stock: parseInt(form.querySelector('[name="stock"]').value) || 0,
      categoryId: form.querySelector('[name="categoryId"]').value || null,
    };

    if (form.querySelector('[name="isActive"]')) {
      data.isActive = form.querySelector('[name="isActive"]').checked;
    }

    // Validate
    if (!data.name) {
      UI.toast.error('Validation Error', 'Product name is required');
      return;
    }

    if (!data.price || data.price <= 0) {
      UI.toast.error('Validation Error', 'Please enter a valid price');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Saving...';

    try {
      if (id) {
        await API.products.update(id, data);
        UI.toast.success('Success', 'Product updated successfully');
      } else {
        await API.products.create(data);
        UI.toast.success('Success', 'Product created successfully');
      }

      UI.modal.close('product-modal');
      await this.load();
    } catch (error) {
      UI.toast.error('Error', error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Product';
    }
  },

  // Handle delete
  async handleDelete(id) {
    const confirmed = await UI.confirm.show({
      title: 'Delete Product?',
      message:
        'This action cannot be undone. The product will be permanently removed.',
      confirmText: 'Delete',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      UI.loading.show();
      await API.products.delete(id);
      UI.toast.success('Success', 'Product deleted successfully');
      await this.load();
    } catch (error) {
      UI.toast.error('Error', error.message);
    } finally {
      UI.loading.hide();
    }
  },

  // Show Details
  async showDetails(id) {
    try {
      UI.loading.show();
      const response = await API.products.getOne(id);
      const product = response.data || response;

      document.getElementById('view-name').textContent = product.name;
      document.getElementById('view-category').textContent =
        product.category?.name || 'Uncategorized';
      document.getElementById('view-price').textContent = UI.formatCurrency(
        product.price,
      );
      document.getElementById('view-stock').textContent = product.stock;
      
      const statusEl = document.getElementById('view-status');
      if (product.isActive) {
          statusEl.innerHTML = '<span class="badge badge-success">Active</span>';
      } else {
          statusEl.innerHTML = '<span class="badge badge-danger">Inactive</span>';
      }
      
      document.getElementById('view-description').textContent =
        product.description || 'No description';

      UI.modal.open('view-product-modal');
    } catch (error) {
      UI.toast.error('Error', 'Failed to load details');
    } finally {
      UI.loading.hide();
    }
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-container')) {
    Products.init();
  }
});

// Export
window.Products = Products;
