// =========================================
// Categories Module - Categories Management
// =========================================

const Categories = {
  currentPage: 1,
  totalPages: 1,
  limit: 20,

  // Initialize categories page
  async init() {
    this.bindEvents();
    await this.load();
  },

  // Bind event listeners
  bindEvents() {
    // Search input
    const searchInput = document.getElementById('categories-search');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.currentPage = 1;
          this.load(e.target.value);
        }, 300);
      });
    }

    // Create category button
    document
      .querySelectorAll('[data-action="create-category"]')
      .forEach((btn) => {
        btn.addEventListener('click', () => this.openModal());
      });

    // Category form submit
    const form = document.getElementById('category-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Event delegation for edit/delete buttons
    document.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('[data-action="edit-category"]');
      const deleteBtn = e.target.closest('[data-action="delete-category"]');
      const viewBtn = e.target.closest('[data-action="view-category"]');

      if (viewBtn) {
        const id = viewBtn.dataset.id;
        await this.showDetails(id);
      }

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

  // Load categories
  async load(search = '') {
    const container = document.getElementById('categories-table-body');
    if (!container) return;

    try {
      // Show loading state
      container.innerHTML = this.renderSkeleton();

      const params = {
        page: this.currentPage,
        limit: this.limit,
      };

      if (search) {
        params.search = search;
      }

      const response = await API.categories.getAll(params);
      const data = response.data || response;

      const categories = data.data || data.items || data;
      const meta = data.meta || {};

      this.totalPages = meta.totalPages || 1;

      if (!Array.isArray(categories) || categories.length === 0) {
        container.innerHTML = this.renderEmpty();
        return;
      }

      container.innerHTML = categories
        .map((category) => this.renderRow(category))
        .join('');

      // Update count
      const countEl = document.getElementById('categories-count');
      if (countEl) {
        countEl.textContent = `${categories.length} categories`;
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      container.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: var(--spacing-8);">
            <div class="text-danger">${error.message}</div>
            <button class="btn btn-secondary mt-4" onclick="Categories.load()">Try Again</button>
          </td>
        </tr>
      `;
    }
  },

  // Render table row
  renderRow(category) {
    const isAdmin = Auth.isAdmin();
    const productCount = category.products?.length || 0;

    return `
      <tr>
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar avatar-sm" style="background: ${this.getColorForName(category.name)};">
              ${category.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="font-medium text-primary">${UI.escapeHtml(category.name)}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="text-secondary">${UI.escapeHtml(category.description || 'No description')}</span>
        </td>
        <td>
          <span class="badge badge-neutral">${productCount} products</span>
        </td>
        <td>
          <span class="badge ${category.isActive ? 'badge-success' : 'badge-danger'}">
            ${category.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          ${
            isAdmin
              ? `
            <div class="table-actions">
              <button class="btn btn-ghost btn-sm" data-action="edit-category" data-id="${category.id}" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm text-danger" data-action="delete-category" data-id="${category.id}" title="Delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          `
          }
          <button class="btn btn-ghost btn-sm" data-action="view-category" data-id="${category.id}" title="View Details">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                 <circle cx="12" cy="12" r="3"/>
             </svg>
          </button>
        </td>
      </tr>
    `;
  },

  // Get consistent color for category name
  getColorForName(name) {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  // Render loading skeleton
  renderSkeleton() {
    return Array(5)
      .fill(
        `
      <tr>
        <td><div class="flex items-center gap-3"><div class="skeleton skeleton-avatar"></div><div class="skeleton skeleton-text" style="width: 120px;"></div></div></td>
        <td><div class="skeleton skeleton-text" style="width: 200px;"></div></td>
        <td><div class="skeleton skeleton-text" style="width: 80px;"></div></td>
        <td><div class="skeleton skeleton-text" style="width: 60px;"></div></td>
        <td><div class="skeleton skeleton-text" style="width: 80px;"></div></td>
      </tr>
    `,
      )
      .join('');
  },

  // Render empty state
  renderEmpty() {
    return `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <h3 class="empty-state-title">No categories found</h3>
            <p class="empty-state-description">Create your first category to organize your products.</p>
            ${Auth.isAdmin() ? `<button class="btn btn-primary" data-action="create-category">Add Category</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  },

  // Open create/edit modal
  async openModal(id = null) {
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const title = document.getElementById('category-modal-title');

    if (!modal || !form) return;

    // Reset form
    form.reset();
    form.dataset.id = id || '';

    if (id) {
      title.textContent = 'Edit Category';
      try {
        UI.loading.show();
        const response = await API.categories.getOne(id);
        const category = response.data || response;

        form.querySelector('[name="name"]').value = category.name || '';
        form.querySelector('[name="description"]').value =
          category.description || '';
        const isActiveCheckbox = form.querySelector('[name="isActive"]');
        if (isActiveCheckbox) {
          isActiveCheckbox.checked = category.isActive !== false;
        }
      } catch (error) {
        UI.toast.error('Error', 'Failed to load category details');
        return;
      } finally {
        UI.loading.hide();
      }
    } else {
      title.textContent = 'Add Category';
      const isActiveCheckbox = form.querySelector('[name="isActive"]');
      if (isActiveCheckbox) {
        isActiveCheckbox.checked = true;
      }
    }

    UI.modal.open('category-modal');
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
    };

    const isActiveCheckbox = form.querySelector('[name="isActive"]');
    if (isActiveCheckbox) {
      data.isActive = isActiveCheckbox.checked;
    }

    // Validate
    if (!data.name) {
      UI.toast.error('Validation Error', 'Category name is required');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Saving...';

    try {
      if (id) {
        await API.categories.update(id, data);
        UI.toast.success('Success', 'Category updated successfully');
      } else {
        await API.categories.create(data);
        UI.toast.success('Success', 'Category created successfully');
      }

      UI.modal.close('category-modal');
      await this.load();
    } catch (error) {
      UI.toast.error('Error', error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Category';
    }
  },

  // Handle delete
  async handleDelete(id) {
    const confirmed = await UI.confirm.show({
      title: 'Delete Category?',
      message:
        'This will remove the category. Products in this category will become uncategorized.',
      confirmText: 'Delete',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      UI.loading.show();
      await API.categories.delete(id);
      UI.toast.success('Success', 'Category deleted successfully');
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
      const response = await API.categories.getOne(id);
      const category = response.data || response;

      document.getElementById('view-name').textContent = category.name;
      document.getElementById('view-products-count').textContent = category.products?.length || 0;
      
      const statusEl = document.getElementById('view-status');
      if (category.isActive) {
          statusEl.innerHTML = '<span class="badge badge-success">Active</span>';
      } else {
          statusEl.innerHTML = '<span class="badge badge-danger">Inactive</span>';
      }
      
      document.getElementById('view-description').textContent =
        category.description || 'No description';

      UI.modal.open('view-category-modal');
    } catch (error) {
      UI.toast.error('Error', 'Failed to load details');
    } finally {
      UI.loading.hide();
    }
  },
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('categories-table-body')) {
    Categories.init();
  }
});

// Export
window.Categories = Categories;
