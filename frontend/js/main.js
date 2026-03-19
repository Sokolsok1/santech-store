const productsContainer = document.getElementById('products');
const applyBtn = document.getElementById('applyFilters');
const resetBtn = document.getElementById('resetFilters');
const filtersContainer = document.getElementById('filters');

let categories = [];
let attributes = [];
let attributeSelects = {}; // select для каждого атрибута

async function loadFilters() {
  // --- Очищаем контейнер фильтров ---
  filtersContainer.innerHTML = '';

  // --- Фильтр по категориям ---
  const categorySelect = document.createElement('select');
  categorySelect.className = 'form-select form-select-sm mb-2';
  categorySelect.id = 'categoryFilter';
  filtersContainer.appendChild(categorySelect);

  categorySelect.innerHTML = `<option value="">Все категории</option>`;

  // Получаем категории с сервера
  const catRes = await fetch('http://localhost:5000/api/categories');
  categories = await catRes.json();

  categories.forEach(cat => {
    if (!cat.parent_id) {
      categorySelect.innerHTML += `<option value="${cat.slug}">${cat.name}</option>`;
      // подкатегории
      const subcats = categories.filter(c => c.parent_id === cat.id);
      subcats.forEach(sub => {
        categorySelect.innerHTML += `<option value="${sub.slug}">&nbsp;&nbsp;${sub.name}</option>`;
      });
    }
  });

  // --- Фильтры по характеристикам ---
  const attrRes = await fetch('http://localhost:5000/api/attributes');
  attributes = await attrRes.json();

  attributeSelects = {}; // очищаем старые selects

  attributes.forEach(attr => {
    const select = document.createElement('select');
    select.className = 'form-select form-select-sm mb-2';
    select.id = `${attr.attribute_slug}Filter`;

    let html = `<option value="">Все ${attr.attribute_name}</option>`;
    attr.values.forEach(v => {
      html += `<option value="${v}">${v}</option>`;
    });

    select.innerHTML = html;
    filtersContainer.appendChild(select);
    attributeSelects[attr.attribute_slug] = select;
  });
}

// Загрузка товаров с применением фильтров
async function loadProducts() {
  const categorySlug = document.getElementById('categoryFilter').value || '';
  const query = new URLSearchParams();

  for (const slug in attributeSelects) {
    const value = attributeSelects[slug].value;
    if (value) query.append(slug, value);
  }

  const url = categorySlug
  ? `http://localhost:5000/api/products/category/${categorySlug}?${query.toString()}`
  : `http://localhost:5000/api/catalog?${query.toString()}`;

  const res = await fetch(url);
  const products = await res.json();

  productsContainer.innerHTML = products.length
    ? products.map(p => `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="card-body">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text">${p.price} ₽</p>
              <a href="product.html?slug=${p.slug}" class="btn btn-primary btn-sm">Подробнее</a>
            </div>
          </div>
        </div>
      `).join('')
    : '<p>Товары не найдены по выбранным фильтрам.</p>';
}

// Применение фильтров
applyBtn.addEventListener('click', () => loadProducts());

// Сброс фильтров
resetBtn.addEventListener('click', () => {
  document.getElementById('categoryFilter').value = '';
  for (const slug in attributeSelects) attributeSelects[slug].value = '';
  loadProducts();
});

// Инициализация
loadFilters().then(loadProducts);