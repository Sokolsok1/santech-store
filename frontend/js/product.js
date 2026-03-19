const productContainer = document.getElementById('product');
const errorContainer = document.getElementById('errorMessage');

// Получаем slug из URL
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

if (!slug) {
  errorContainer.textContent = 'Ошибка: не указан товар.';
  errorContainer.classList.remove('d-none');
} else {
  loadProduct(slug);
}

async function loadProduct(slug) {
  try {
    const res = await fetch(`http://localhost:5000/api/product/${slug}`);

    if (!res.ok) {
      errorContainer.textContent = 'Товар не найден или сервер недоступен.';
      errorContainer.classList.remove('d-none');
      return;
    }

    const p = await res.json();

    productContainer.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${p.image}" class="img-fluid" alt="${p.name}">
        </div>
        <div class="col-md-6">
          <h2>${p.name}</h2>
          <p><strong>Цена:</strong> ${p.price} ₽</p>
          ${p.old_price ? `<p><del>${p.old_price} ₽</del></p>` : ''}
          <p><strong>Бренд:</strong> ${p.brand}</p>
          <p><strong>Страна:</strong> ${p.country}</p>
          <p><strong>Артикул:</strong> ${p.sku}</p>
          <p><strong>В наличии:</strong> ${p.stock}</p>
          <h5>Характеристики:</h5>
          <ul>
            ${p.attributes && p.attributes.length > 0
              ? p.attributes.map(a => `<li>${a.attribute_name}: ${a.attribute_value}</li>`).join('')
              : '<li>Характеристики отсутствуют</li>'
            }
          </ul>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    errorContainer.textContent = 'Ошибка подключения к серверу.';
    errorContainer.classList.remove('d-none');
  }
}