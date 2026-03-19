const productsContainer = document.getElementById('products');
const applyBtn = document.getElementById('applyFilters');
const resetBtn = document.getElementById('resetFilters');
const filtersContainer = document.getElementById('filters');

let attributeSelects = {};
let currentPage = 1;
const limit = 6;

const API = "http://localhost:5000/api";

// =====================
// ФИЛЬТРЫ + СОРТИРОВКА
// =====================
async function loadFilters() {

  filtersContainer.innerHTML = '';

  // категории
  const categorySelect = document.createElement('select');
  categorySelect.className = 'form-select form-select-sm mb-2';
  categorySelect.id = 'categoryFilter';
  categorySelect.innerHTML = `<option value="">Все категории</option>`;
  filtersContainer.appendChild(categorySelect);

  const catRes = await fetch(`${API}/categories`);
  const categories = await catRes.json();

  categories.forEach(cat => {
    if (!cat.parent_id) {
      categorySelect.innerHTML += `<option value="${cat.slug}">${cat.name}</option>`;
      const subs = categories.filter(c => c.parent_id === cat.id);
      subs.forEach(sub => {
        categorySelect.innerHTML += `<option value="${sub.slug}">— ${sub.name}</option>`;
      });
    }
  });

  // 🔥 СОРТИРОВКА
  const sortSelect = document.createElement('select');
  sortSelect.className = 'form-select form-select-sm mb-2';
  sortSelect.id = 'sortFilter';
  sortSelect.innerHTML = `
    <option value="price_asc">Цена ↑</option>
    <option value="price_desc">Цена ↓</option>
    <option value="name_asc">Название А-Я</option>
    <option value="name_desc">Название Я-А</option>
  `;
  filtersContainer.appendChild(sortSelect);

  // атрибуты
  const attrRes = await fetch(`${API}/attributes`);
  const attributes = await attrRes.json();

  attributeSelects = {};

  attributes.forEach(attr => {
    const select = document.createElement('select');
    select.className = 'form-select form-select-sm mb-2';

    let html = `<option value="">Все ${attr.attribute_name}</option>`;
    attr.values.forEach(v => {
      html += `<option value="${v}">${v}</option>`;
    });

    select.innerHTML = html;
    filtersContainer.appendChild(select);

    attributeSelects[attr.attribute_slug] = select;
  });
}

// =====================
// ЗАГРУЗКА ТОВАРОВ
// =====================
async function loadProducts(page = 1) {

  currentPage = page;

  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;

  const query = new URLSearchParams();

  if (category) query.append('category', category);
  if (sort) query.append('sort', sort);

  for (const slug in attributeSelects) {
    const val = attributeSelects[slug].value;
    if (val) query.append(slug, val);
  }

  query.append('page', page);
  query.append('limit', limit);

  const res = await fetch(`${API}/catalog?${query.toString()}`);
  const data = await res.json();

  renderProducts(data.products);
  renderPagination(data.pages);
}

// =====================
// РЕНДЕР ТОВАРОВ
// =====================
function renderProducts(products) {

  productsContainer.innerHTML = '';

  if (!products.length) {
    productsContainer.innerHTML = '<p>Товары не найдены</p>';
    return;
  }

  products.forEach(p => {
    productsContainer.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm">
          <img src="${p.image || 'https://via.placeholder.com/300x200'}" 
               class="card-img-top">

          <div class="card-body d-flex flex-column">
            <h6>${p.name}</h6>
            <p class="fw-bold">${p.price} ₽</p>

            <a href="product.html?slug=${p.slug}" 
               class="btn btn-primary btn-sm mt-auto">
               Подробнее
            </a>
          </div>
        </div>
      </div>
    `;
  });
}

// =====================
// ПАГИНАЦИЯ
// =====================
function renderPagination(pages) {

  let pagination = document.getElementById('pagination');

  if (!pagination) {
    pagination = document.createElement('div');
    pagination.id = 'pagination';
    pagination.className = 'mt-4 d-flex gap-2 flex-wrap';
    productsContainer.after(pagination);
  }

  pagination.innerHTML = '';

  for (let i = 1; i <= pages; i++) {
    pagination.innerHTML += `
      <button 
        class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}"
        onclick="loadProducts(${i})">
        ${i}
      </button>
    `;
  }
}

// =====================
// СОБЫТИЯ
// =====================
applyBtn.addEventListener('click', () => loadProducts(1));

resetBtn.addEventListener('click', () => {
  document.getElementById('categoryFilter').value = '';
  document.getElementById('sortFilter').value = 'price_asc';

  for (const key in attributeSelects) {
    attributeSelects[key].value = '';
  }

  loadProducts(1);
});

// =====================
// СТАРТ
// =====================
loadFilters().then(() => loadProducts(1));