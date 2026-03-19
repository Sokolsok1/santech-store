const API = 'http://localhost:5000/api'

async function loadProducts() {
    const res = await fetch(`${API}/products`)
    const data = await res.json()

    const table = document.getElementById('productsTable')
    if (!table) return

    table.innerHTML = ''
    data.forEach(p => {
        table.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.sku}</td>
            <td>${p.price}</td>
            <td>${p.stock}</td>
            <td>
                <a href="product-edit.html?id=${p.id}" class="btn btn-sm btn-primary">✏</a>
                <button onclick="deleteProduct(${p.id})" class="btn btn-sm btn-danger">🗑</button>
            </td>
        </tr>`
    })
}

async function deleteProduct(id) {
    await fetch(`${API}/products/${id}`, { method: 'DELETE' })
    loadProducts()
}

loadProducts()