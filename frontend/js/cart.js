function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function addToCart(product) {
    let cart = getCart();
    const existing = cart.find(p => p.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, p) => sum + p.quantity, 0);
    const el = document.getElementById("cart-count");
    if (el) el.innerText = total;
}

updateCartCount();