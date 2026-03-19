const API = "http://localhost:5000/api";

async function loadFilters() {
    const res = await fetch(`${API}/products/filters`);
    const data = await res.json();

    // Бренды
    const brandDiv = document.getElementById("brandFilters");
    data.brands.forEach(b => {
        brandDiv.innerHTML += `
        <div>
            <input type="radio" name="brand" value="${b.brand}"> ${b.brand}
        </div>`;
    });

    // Страны
    const countryDiv = document.getElementById("countryFilters");
    data.countries.forEach(c => {
        countryDiv.innerHTML += `
        <div>
            <input type="radio" name="country" value="${c.country}"> ${c.country}
        </div>`;
    });

    // Динамические характеристики
    const dynamicDiv = document.getElementById("dynamicFilters");
    data.attributes.forEach(attr => {
        let html = `<div class="card p-3 mb-3"><h6>${attr.attribute_name}</h6>`;
        attr.values.forEach(val => {
            html += `
            <div>
                <input type="checkbox" 
                       data-attr="${attr.attribute_name}" 
                       value="${val}">
                ${val}
            </div>`;
        });
        html += "</div>";
        dynamicDiv.innerHTML += html;
    });
}

async function applyFilters() {
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;

    const brand = document.querySelector('input[name="brand"]:checked')?.value;
    const country = document.querySelector('input[name="country"]:checked')?.value;

    let attributes = {};
    document.querySelectorAll("#dynamicFilters input:checked").forEach(el => {
        attributes[el.dataset.attr] = el.value;
    });

    const params = new URLSearchParams();

    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (brand) params.append("brand", brand);
    if (country) params.append("country", country);
    if (Object.keys(attributes).length)
        params.append("attributes", JSON.stringify(attributes));

    const res = await fetch(`${API}/products?${params.toString()}`);
    const products = await res.json();

    renderProducts(products);
}

function renderProducts(products) {
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5>${p.name}</h5>
                    <p>${p.price} ₽</p>
                    <a href="product.html?id=${p.id}" 
                       class="btn btn-primary">Подробнее</a>
                </div>
            </div>
        </div>`;
    });
}

loadFilters();
applyFilters();