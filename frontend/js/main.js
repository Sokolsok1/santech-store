const productsContainer = document.getElementById('products');
const applyBtn = document.getElementById('applyFilters');
const resetBtn = document.getElementById('resetFilters');
const filtersContainer = document.getElementById('filters');

let categories = [];
let attributes = [];
let attributeSelects = {};

const API = "http://localhost:5000/api";

// =====================
// ЗАГРУЗКА ФИЛЬТРОВ
// =====================
async function loadFilters() {

  filtersContainer.innerHTML = '';

  // --- Категории ---
  const categorySelect = document.createElement('select');
  categorySelect.className = 'form-select form-select-sm mb-2';
  categorySelect.id = 'categoryFilter';

  categorySelect.innerHTML = `<option value="">Все категории</option>`;
  filtersContainer.appendChild(categorySelect);

  const catRes = await fetch(`${API}/categories`);
  categories = await catRes.json();

  categories.forEach(cat => {
    if (!cat.parent_id) {
      categorySelect.innerHTML += `<option value="${cat.slug}">${cat.name}</option>`;

      const subs = categories.filter(c => c.parent_id === cat.id);
      subs.forEach(sub => {
        categorySelect.innerHTML += `<option value="${sub.slug}">— ${sub.name}</option>`;
      });
    }
  });

  // --- Атрибуты ---
  const attrRes = await fetch(`${API}/attributes`);
  attributes = await attrRes.json();

  attributeSelects = {};

  attributes.forEach(attr => {
    const select = document.createElement('select');
    select.className = 'form-select form-select-sm mb-2';
    select.id = `${attr.attribute_slug}`;

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
async function loadProducts() {

  const category = document.getElementById('categoryFilter').value;
  const query = new URLSearchParams();

  if (category) query.append('category', category);

  for (const slug in attributeSelects) {
    const val = attributeSelects[slug].value;
    if (val) query.append(slug, val);
  }

  const res = await fetch(`${API}/catalog?${query.toString()}`);
  const products = await res.json();

  renderProducts(products);
}

// =====================
// РЕНДЕР
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
// СОБЫТИЯ
// =====================
applyBtn.addEventListener('click', loadProducts);

resetBtn.addEventListener('click', () => {
  document.getElementById('categoryFilter').value = '';
  for (const key in attributeSelects) {
    attributeSelects[key].value = '';
  }
  loadProducts();
});

// =====================
// СТАРТ
// =====================
loadFilters().then(loadProducts);