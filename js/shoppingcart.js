export { ShoppingCartProduct, writeCartPage, cartResults, clearCart }
// import { Interface } from "readline";

// interface ShoppingCartProduct {
//     name: string;
//     image: string;
//     color: string;
//     size: string;
//     quantity: number;
//     

// }

const shoppingCartProducts = [];
class ShoppingCartProduct {
    constructor(product, color, size, quanity) {
        this.name = product.name;
        this.image = "images/kids_backpack.jpg";
        this.color = color;
        this.size = size;
        this.price = product.price;
        this.quanity = quanity;
        this.subtotal = function () {
            return this.price * this.quanity;
        };
    }
}

export { addToShoppingCart }
function addToShoppingCart(cartProduct) {
    shoppingCartProducts.push(cartProduct);
    console.log(shoppingCartProducts.length);
    const prodShopTemplate = document.querySelector('#cartItemTemplate');
    const productPage = document.querySelector('#shoppingCartGrid');
    const productClone = prodShopTemplate.content.cloneNode(true);

    productClone.querySelector('#product-remove').addEventListener('click', ()=> removeProduct(cartProduct));
    productClone.querySelector('.product-image').src = cartProduct.image;
    productClone.querySelector('.product-title').textContent = cartProduct.name;
    productClone.querySelector('.product-color').style.backgroundColor = cartProduct.color;
    productClone.querySelector('.product-size').textContent = cartProduct.size;
    productClone.querySelector('.product-price').textContent = currency(cartProduct.price);
    productClone.querySelector('.product-quantity').textContent = cartProduct.quanity;
    productClone.querySelector('.product-subtotal').textContent = currency(cartProduct.subtotal());

    const visible = document.querySelector('#checkoutForm');
    if (visible.classList.contains('invisible')) visible.classList.toggle('invisible');
    productPage.appendChild(productClone);
    cartResults();
}

function removeProduct(cartProduct) {
    const productToRemove = shoppingCartProducts.find(c => c === cartProduct)
    shoppingCartProducts.splice(productToRemove)
}

const currency = function (num) {
    return new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(num);
}

function writeCartPage() {
    const cartCount = document.querySelector('.cart-count');
    let count = 0;
    // shoppingCartProducts.forEach(scp => count += Number(scp.quanity));
    cartCount.dataset.cartcount = 0;
    cartCount.textContent = count;
    const form = document.querySelector('#checkoutForm');
    form.querySelector('#shipping').addEventListener('change', () => {
        console.log('shippingtype');
        cartResults();
    })
    form.querySelector('#destination').addEventListener('change', () => {
        console.log('destination');
        cartResults();
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (shoppingCartProducts.length === 0) return;
        clearCart();
    })
    cartResults()
}
function cartResults() {
    const merchDiv = document.querySelector('#merchAmount');
    const shippingDiv = document.querySelector('#shippingAmount');
    const taxDiv = document.querySelector('#taxAmount');
    const totalDiv = document.querySelector('#totalAmount');
    let merchAmount = 0;
    let shippingAmount = 0;
    let taxAmount = 0;
    if (shoppingCartProducts.length > 0) 
        shoppingCartProducts.forEach(scp => merchAmount += scp.subtotal());
    if (merchAmount <= 500) shippingAmount = calculateShippingCost();
    if (document.querySelector('#destination').value == 1) taxAmount = merchAmount * 0.05;
    merchDiv.textContent = currency(merchAmount);
    shippingDiv.textContent = currency(shippingAmount);
    taxDiv.textContent = currency(taxAmount);
    totalDiv.textContent = currency(merchAmount + shippingAmount + taxAmount);
}

function clearCart() {
    if (shoppingCartProducts.length === 0) return;
    document.querySelector('#checkoutForm').classList.add('invisible');
    document.querySelector('#shoppingCartGrid').replaceChildren();
    shoppingCartProducts.length = 0;
    writeCartPage();
}

function calculateShippingCost() {
    const shipping = Number(document.querySelector('#shipping').value + document.querySelector('#destination').value);
    let cost;
    switch (shipping) {
        case 11:
            return cost = 10;
        case 12:
            return cost = 25;
        case 13:
            return cost = 35;
        case 21:
            return cost = 15;
        case 22:
            return cost = 25;
        case 23:
            return cost = 50;
        case 31:
            return cost = 20;
        case 32:
            return cost = 30;
        case 33:
            return cost = 50;
        default:
            return cost = 0;
    }
}