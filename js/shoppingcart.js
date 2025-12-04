export { ShoppingCartProduct }
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
function ShoppingCartProduct(product, color, size, quanity) {
    this.name = product.name;
    this.image = "images/kids_backpack.jpg";
    this.color = color;
    this.size = size;
    this.price = product.price;
    this.quanity = quanity;
    this.subtotal = function () {
        return this.price * this.quanity;
    }
}

export { addToShoppingCart }
function addToShoppingCart(cartProduct) {
    shoppingCartProducts.push(cartProduct);
    const prodShopTemplate = document.querySelector('#cartItemTemplate');
    const productPage = document.querySelector('#shoppingCartGrid');
    const productClone = prodShopTemplate.content.cloneNode(true);

    productClone.querySelector('.product-image').src = cartProduct.image;
    productClone.querySelector('.product-title').textContent = cartProduct.name;
    productClone.querySelector('.product-color').textContent = cartProduct.color;
    productClone.querySelector('.product-size').textContent = cartProduct.size;
    productClone.querySelector('.product-price').textContent = currency(cartProduct.price);
    productClone.querySelector('.product-quantity').textContent = cartProduct.quanity;
    productClone.querySelector('.product-subtotal').textContent = currency(cartProduct.subtotal());


    productPage.appendChild(productClone);
}

function removeProduct(cartProduct){
    const productToRemove = shoppingCartProducts.find(c => c === cartProduct)
    shoppingCartProducts.splice(productToRemove)
}

const currency = function (num) {
    return new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(num);
}