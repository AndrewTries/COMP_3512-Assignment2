import { goToPage, products } from "./index.js";
import { makeProduct } from "./product.js";
export { ShoppingCartProduct, writeCartPage, cartResults }

// interface ShoppingCartProduct {
//     groupID: String;
//     id: String;
//     name: String;
//     image: String;
//     color: String;
//     size: String;
//     price: Number;
//     quantity: Number;
//     subtotal: Number;
// }

const shoppingCartProducts = [];
class ShoppingCartProduct {
    constructor(product, color, size, quantity) {
        this.groupID = product.id + size + color;
        this.id = product.id;
        this.name = product.name;
        this.image = "images/kids_backpack.jpg";
        this.color = color;
        this.size = size;
        this.price = Number(product.price);
        this.quantity = Number(quantity);
        this.subtotal = function () {
            return this.price * this.quantity;
        };
    }
}

export { addToShoppingCart }
function addToShoppingCart(cartProduct) {
    if (productInCart(cartProduct)) return;

    shoppingCartProducts.push(cartProduct);
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCartProducts));

    const prodShopTemplate = document.querySelector('#cartItemTemplate');
    const productPage = document.querySelector('#shoppingCartGrid');
    const productClone = prodShopTemplate.content.cloneNode(true);

    /* Set data attributes of cart node */
    const dataSet = productClone.querySelector('.cart-id');
    dataSet.setAttribute('data-cart-group', cartProduct.groupID);
    dataSet.setAttribute('data-cart-id', cartProduct.id);
    dataSet.setAttribute('data-cart-size', cartProduct.size);
    dataSet.setAttribute('data-cart-color', cartProduct.color);

    /* Set content of cart nodes with product information */
    /* ----------------------------------------------------------------------------------------------- */
    productClone.querySelector('#product-remove').addEventListener('click', () => removeProduct(cartProduct));
    const img = productClone.querySelector('.product-image');
    const title = productClone.querySelector('.product-title');
    productClone.querySelector('.product-color').style.backgroundColor = cartProduct.color;
    productClone.querySelector('.product-size').textContent = cartProduct.size;
    productClone.querySelector('.product-price').textContent = currency(cartProduct.price);
    productClone.querySelector('.product-quantity').textContent = cartProduct.quantity;
    productClone.querySelector('.product-subtotal').textContent = currency(cartProduct.subtotal());

    productClone.querySelector('#removeCount').addEventListener('click', () => {
        const cartCount = document.querySelector('#cart-count');
        cartCount.dataset.cartcount--;
        cartCount.textContent--;
        cartProduct.quantity--;
        writecartItem(cartProduct);
    });
    productClone.querySelector('#addCount').addEventListener('click', () => {
        const cartCount = document.querySelector('#cart-count');
        cartCount.dataset.cartcount++;
        cartCount.textContent++;
        cartProduct.quantity++;
        writecartItem(cartProduct);
    });

    /* Add goToPage click events on image and titles */
    img.src = cartProduct.image;
    title.textContent = cartProduct.name;
    const product = products.find(p => p.id === cartProduct.id);
    [img, title].forEach(e => e.addEventListener("click", () => {
        makeProduct(product);
        goToPage('singleproduct');
    }));
    /* ----------------------------------------------------------------------------------------------- */


    /* Toggle cart visibility when first product is added */
    toggleVisibility();

    productPage.appendChild(productClone);
    cartResults();
}

function writecartItem(cartProduct) {
    if (cartProduct.quantity === 0) return removeProduct(cartProduct);
    const cart_id = document.querySelector(`[data-cart-group="${cartProduct.groupID}"]`);
    cart_id.querySelector('.product-quantity').textContent = cartProduct.quantity;
    cart_id.querySelector('.product-subtotal').textContent = currency(cartProduct.subtotal());
    cartResults();
}

function productInCart(cartProduct) {
    const prodInCart = shoppingCartProducts.find(c => c.groupID === cartProduct.groupID);
    if (prodInCart) {
        prodInCart.quantity += cartProduct.quantity;
        const localCart = JSON.parse(localStorage.getItem('shoppingCart'));
        const localItem = localCart.find(sc => sc.groupID === prodInCart.groupID);
        if (localItem) localItem.quantity = prodInCart.quantity;
        localStorage.setItem('shoppingCart', JSON.stringify(localCart));
        writecartItem(prodInCart);
        return true;
    }
}

/* Add toggles for shopping cart item visibility */
function toggleVisibility() {
    const emptyCart = document.querySelector('.shoppingcart-hide');
    if (!emptyCart.classList.contains('hidden'))
        emptyCart.classList.toggle('hidden');

    const visible = document.querySelector('#shoppingcart-hide');
    if (visible.classList.contains('invisible'))
        visible.classList.toggle('invisible');
}

/* Remove product card from cart */
function removeProduct(cartProduct) {
    if (!shoppingCartProducts.find(c => c.groupID === cartProduct.groupID)) return;
    const cart_id = document.querySelector(`[data-cart-group="${cartProduct.groupID}"]`);
    cart_id.remove();
    const productToRemove = shoppingCartProducts.indexOf(cartProduct);
    shoppingCartProducts.splice(productToRemove, 1);
    const cartCount = document.querySelector('#cart-count');
    cartCount.dataset.cartcount -= cartProduct.quantity;
    cartCount.textContent = cartCount.dataset.cartcount;
    shoppingCartProducts.length === 0 ? clearCart() : cartResults();
}

const currency = function (num) {
    return new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(num);
}


/* ----------------------------------------------------------------------------------------------- */
/* Writes the cart page when first loaded */
function writeCartPage() {

    /* Load shopping cart from local storage*/
    const retrievedCart = JSON.parse(localStorage.getItem('shoppingCart'));
    setUpShoppingCartProducts(retrievedCart);
    let productCount = 0;
    shoppingCartProducts.forEach(sc => productCount += sc.quantity)

    document.querySelector('#leave-cart').addEventListener('click', () => goToPage('browse'));
    const cartCount = document.querySelector('#cart-count');
    cartCount.dataset.cartcount = productCount;
    cartCount.textContent = productCount;
    const form = document.querySelector('#checkoutForm');
    form.querySelector('#shipping').addEventListener('change', () => cartResults());
    form.querySelector('#destination').addEventListener('change', () => cartResults());
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (shoppingCartProducts.length === 0) return;
        clearCart();
    });
    cartResults();
}

function setUpShoppingCartProducts(retrievedCart) {
    if (retrievedCart) {
        retrievedCart.forEach(sc => {
            sc.subtotal = function () {
                return this.price * this.quantity;
            }
            addToShoppingCart(new ShoppingCartProduct(sc, sc.color, sc.size, sc.quantity));
        });
    }
}

/* ----------------------------------------------------------------------------------------------- */

/* Manages updating the summary form */
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
    if (document.querySelector('#destination').value == 1)
        taxAmount = merchAmount * 0.05;
    merchDiv.textContent = currency(merchAmount);
    shippingDiv.textContent = currency(shippingAmount);
    taxDiv.textContent = currency(taxAmount);
    totalDiv.textContent = currency(merchAmount + shippingAmount + taxAmount);
}

/* Clears the shopping cart of all products */
function clearCart() {
    const checkOutMessage = document.querySelector('#checkOutMessage')
    checkOutMessage.classList.toggle('opacity-0');
    checkOutMessage.classList.toggle('invisible');
    checkOutMessage.textContent = 'Thank you for your patronage!';
    setTimeout(() => {
        checkOutMessage.classList.toggle('opacity-0');
        checkOutMessage.classList.toggle('invisible');
    }, 4000);
    
    document.querySelector('.shoppingcart-hide').classList.remove('hidden');
    document.querySelector('#shoppingcart-hide').classList.add('invisible');
    document.querySelector('#shoppingCartGrid').replaceChildren();
    shoppingCartProducts.length = 0;
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCartProducts));
    const cartCount = document.querySelector('#cart-count');
    cartCount.dataset.cartcount = 0;
    cartCount.textContent = 0;
}

/* Calculates shipping cost based on selected shipping type and destination */
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