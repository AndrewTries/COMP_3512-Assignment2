import { products, useGoToPage, goToPage } from './index.js';
import { addToShoppingCart, ShoppingCartProduct } from './shoppingcart.js';
export { makeProduct, makeProductCard };

/* Main function managing product page creation */
function makeProduct(product) {
    const prodCardTemplate = document.querySelector('#singleProductTemplate');
    const productPage = document.querySelector('#productPage');
    /* Clears product page when initialized */
    productPage.replaceChildren();
    const productClone = prodCardTemplate.content.cloneNode(true);

    const imgs = productClone.querySelectorAll(".product-image");
    imgs.forEach(img => {
        img.addEventListener("click", () => { makeProduct(product) });
        img.setAttribute("src", "images/kids_backpack.jpg");
        img.setAttribute("alt", product.name);
    });

    breadcrumbs(productClone, product);

    productClone.querySelector(".product-name").textContent = product.name;
    productClone.querySelector(".product-price").textContent = `$${product.price}`;
    productClone.querySelector(".product-description").textContent = `${product.description}`;
    productClone.querySelector(".product-material").textContent = `${product.material}`;
    productClone.querySelector("#relatedCategory").textContent += ` ${product.category}`;

    attachRelated(product, productClone);
    const addToCart = productClone.querySelector(".add-to-cart-btn");

    /* Default Size*/
    addToCart.setAttribute('data-size', product.sizes[0]);

    /* Default Color*/
    addToCart.setAttribute('data-color', `${product.color[0].hex}`);

    product.sizes.forEach(s => {
        const productSize = productClone.querySelector(".product-size");
        const sizeIcon = document.createElement('span');
        sizeIcon.textContent = `${s}`;
        sizeIcon.classList.add('h-8', 'border-1', 'border-black', 'text-center', 'justify-center', 'hover:cursor-pointer');
        s !== 'One Size' ? sizeIcon.classList.add('aspect-square') : sizeIcon.classList.add('px-1');

        sizeIcon.addEventListener("click", () => {
            addToCart.setAttribute('data-size', s)
            productSize.querySelectorAll('span').forEach(s => s.classList.remove('border-3'));
            sizeIcon.classList.toggle('border-3');
        });
        if (productSize.querySelector('span'))
            productSize.querySelector('span').classList.add('border-3');
        productSize.appendChild(sizeIcon);
    })

    product.color.forEach(c => {
        const productColor = productClone.querySelector(".product-color");
        const colorIcon = document.createElement('span');
        colorIcon.style.backgroundColor = `${c.hex}`;
        colorIcon.classList.add('h-8', 'aspect-square', 'border-1', 'hover:cursor-pointer');
        colorIcon.addEventListener("click", () => {
            addToCart.setAttribute('data-color', `${c.hex}`)
            productColor.querySelectorAll('span').forEach(s => s.classList.remove('border-3'));
            colorIcon.classList.toggle('border-3');
        });
        if (productColor.querySelector('span')) productColor.querySelector('span').classList.add('border-3');
        productColor.appendChild(colorIcon);
    })
    const productQuantity = productClone.querySelector("#quantity");
    productQuantity.addEventListener("input", () => addToCart.setAttribute('data-quantity', productQuantity.value));

    addProductToCart(product, addToCart);

    productPage.appendChild(productClone);
}

function breadcrumbs(container, product) {
    const breadcrumbs = container.querySelector("#breadcrumbs");
    const crumbs = breadcrumbs.querySelectorAll('[data-page]');
    breadcrumbs.textContent = `Browse > ${product.gender} > ${product.category} > ${product.name}`;
    breadcrumbs.setAttribute('data-page', 'browse');
    breadcrumbs.addEventListener("click", () => { goToPage('browse') });
}

/* Algorithm determining which assosiated products to show */
/* generally 2 products based on price and 2 based on category */
function attachRelated(product, parentTemplate) {
    const filteredCategory = products.filter(p =>
        p.category === product.category
        && p.name !== product.name);

    /* Randomly sorts array before choosing the products */
    filteredCategory.sort(function () { return 0.5 - Math.random() });
    const relatedCategory = filteredCategory.slice(0, 2);

    /* Products featured by price are within 10% of the base product price */
    let filteredPrice = products.filter(p =>
    ((p.price >= product.price - (product.price * 0.1)
        && p.price <= product.price + (product.price * 0.1))
        && (p.name !== product.name)));
    filteredPrice = filteredPrice.filter(p => !relatedCategory.includes(p));
    filteredPrice.sort(function () { return 0.5 - Math.random() });
    const relatedPrice = filteredPrice.slice(0, 2);

    const prodCardTemplate = document.querySelector('#relatedTemplate');
    const relatedCategoryList = parentTemplate.querySelector('#relatedCategoryProducts');
    const relatedPriceList = parentTemplate.querySelector('#relatedPriceProducts');
    makeProductCard(prodCardTemplate, relatedCategoryList, relatedCategory);
    makeProductCard(prodCardTemplate, relatedPriceList, relatedPrice);
}

/* Function creating each product card that is not the product page */
function makeProductCard(prodCardTemplate, parent, productList) {
    productList.forEach(p => {
        const productClone = prodCardTemplate.content.cloneNode(true);

        const img = productClone.querySelector(".product-image");
        img.addEventListener("click", () => { makeProduct(p) });
        img.setAttribute("src", "images/kids_backpack.jpg");
        img.setAttribute("alt", p.name);

        const productName = productClone.querySelector(".product-name");
        productName.addEventListener("click", () => makeProduct(p));
        productName.textContent = p.name;

        productClone.querySelector(".product-price").textContent = `$${p.price}`;

        const linkToProduct = productClone.querySelectorAll('[data-page]');
        useGoToPage(linkToProduct);

        const addToCart = productClone.querySelector(".add-to-cart-btn");

        /* Default Size*/
        addToCart.setAttribute('data-size', p.sizes[0]);
        /* Default Color*/
        addToCart.setAttribute('data-color', `${p.color[0].hex}`);
        addToCart.setAttribute('data-quantity', `1`);

        addProductToCart(p, addToCart);
        parent.appendChild(productClone);
    })
}



/* This function will add a product to the shopping cart list and increment the cart count */
/* This is the only function which interacts with the shopping cart on this page */
function addProductToCart(product, addToCart) {
    addToCart.addEventListener("click", () => {
        const addToCartMessage = document.querySelector('#addToCartMessage')
        addToCartMessage.classList.toggle('opacity-0');
        addToCartMessage.classList.toggle('invisible');
        addToCartMessage.textContent = `${product.name} (${addToCart.dataset.size}, ${product.color[0].name}) added to cart.`;
        setTimeout(() => {
            addToCartMessage.classList.toggle('opacity-0');
            addToCartMessage.classList.toggle('invisible');
        }, 4000);

        let cart = document.querySelector('#cart-count');
        const cartCount = Number(cart.dataset.cartcount) + Number(addToCart.dataset.quantity);
        cart.textContent = cartCount;
        cart.setAttribute('data-cartcount', cartCount);
        (product)
        addToShoppingCart(new ShoppingCartProduct(product, addToCart.dataset.color, addToCart.dataset.size, addToCart.dataset.quantity));
    });
}