const API = "http://localhost:5000/api";

async function getProducts() {
    const res = await fetch(`${API}/products`);
    return res.json();
}

async function getProduct(id) {
    const res = await fetch(`${API}/products/${id}`);
    return res.json();
}