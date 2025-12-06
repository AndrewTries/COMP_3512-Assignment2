import { goToPage, products } from "./index.js";
import { makeProduct } from "./product.js";
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
        this.id = product.id;
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
    if (productInCart(cartProduct)) return;

    shoppingCartProducts.push(cartProduct);

    const prodShopTemplate = document.querySelector('#cartItemTemplate');
    const productPage = document.querySelector('#shoppingCartGrid');
    const productClone = prodShopTemplate.content.cloneNode(true);

    const dataSet = productClone.querySelector('.cart-id');
    dataSet.setAttribute('data-cart-group', cartProduct.id + cartProduct.size + cartProduct.color);
    dataSet.setAttribute('data-cart-id', cartProduct.id);
    dataSet.setAttribute('data-cart-size', cartProduct.size);
    dataSet.setAttribute('data-cart-color', cartProduct.color);

    productClone.querySelector('#product-remove').addEventListener('click', () => removeProduct(cartProduct));
    const img = productClone.querySelector('.product-image');
    const title = productClone.querySelector('.product-title');
    productClone.querySelector('.product-color').style.backgroundColor = cartProduct.color;
    productClone.querySelector('.product-size').textContent = cartProduct.size;
    productClone.querySelector('.product-price').textContent = currency(cartProduct.price);
    productClone.querySelector('.product-quantity').textContent = cartProduct.quanity;
    productClone.querySelector('.product-subtotal').textContent = currency(cartProduct.subtotal());

    const product = products.find(p => p.id === cartProduct.id);
    img.src = cartProduct.image;
    img.addEventListener("click", () => {
        makeProduct(product);
        goToPage('singleproduct');
    });

    title.textContent = cartProduct.name;
    title.addEventListener("click", () => {
        makeProduct(product)
        goToPage('singleproduct');
    });

    const emptyCart = document.querySelector('.shoppingcart-hide');
    if (!emptyCart.classList.contains('hidden'))
        emptyCart.classList.toggle('hidden');

    const visible = document.querySelector('#shoppingcart-hide');
    if (visible.classList.contains('invisible'))
        visible.classList.toggle('invisible');

    productPage.appendChild(productClone);
    cartResults();
}

function productInCart(cartProduct) {
    const prodInCart = shoppingCartProducts.find(c => ((c.id === cartProduct.id) && (c.size === cartProduct.size) && (c.color === cartProduct.color)));
    if (prodInCart) {
        console.log(prodInCart)
        // console.log('PcartQ',prodInCart.quanity);
        // console.log('cartQ',cartProduct.quanity);
        prodInCart.quanity++;
        // Number(prodInCart.quanity) += Number(cartProduct.quanity);
        const cart_id = document.querySelector(`[data-cart-group="${cartProduct.id + cartProduct.size + cartProduct.color}"]`);
        cart_id.querySelector('.product-quantity').textContent = prodInCart.quanity;
        cart_id.querySelector('.product-subtotal').textContent = currency(prodInCart.subtotal());
        return true;
    }
}

function removeProduct(cartProduct) {
    if (!shoppingCartProducts.find(c => c === cartProduct)) return;
    const cart_id = document.querySelector(`[data-cart-group="${cartProduct.id + cartProduct.size + cartProduct.color}"]`);
    cart_id.remove();
    const productToRemove = shoppingCartProducts.indexOf(cartProduct)
    shoppingCartProducts.splice(productToRemove, 1);
    const cartCount = document.querySelector('.cart-count');
    cartCount.dataset.cartcount--;
    cartCount.textContent = cartCount.dataset.cartcount;
    shoppingCartProducts.length == 0 ? clearCart() : cartResults();
    console.log(shoppingCartProducts.length)
}

const currency = function (num) {
    return new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(num);
}

function writeCartPage() {
    document.querySelector('#leave-cart').addEventListener('click', () => {
        goToPage('browse');
    })
    const cartCount = document.querySelector('.cart-count');
    // shoppingCartProducts.forEach(scp => count += Number(scp.quanity));
    cartCount.dataset.cartcount = 0;
    cartCount.textContent = 0;
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
    document.querySelector('.shoppingcart-hide').classList.remove('hidden');
    document.querySelector('#shoppingcart-hide').classList.add('invisible');
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