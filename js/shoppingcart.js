export { addToShoppingCart }
function addToShoppingCart(product) {
    const prodShopTemplate = document.querySelector('#cartItemTemplate');
    const productPage = document.querySelector('#shoppingCartGrid');
    const productClone = prodShopTemplate.content.cloneNode(true);

    const img = productClone.querySelector('.product-image');
    img.addEventListener("click", () => { makeProduct(product) });
    img.setAttribute("src", "images/kids_backpack.jpg");
    img.setAttribute("alt", product.name);

    productClone.querySelector('.product-title').textContent = product.name;
    const shoppingButton = document.querySelector('.add-to-cart-btn');
    console.log("Data Color", shoppingButton.dataset.color)
    const color = productClone.querySelector('.product-color').textContent = shoppingButton.dataset.color;
    const size = productClone.querySelector('.product-size');
    productClone.querySelector('.product-price').textContent = `$${product.price}`;
    const quanity = productClone.querySelector('.product-quanity');

    productPage.appendChild(productClone);
}