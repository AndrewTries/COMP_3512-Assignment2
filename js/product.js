import { products, useGoToPage, goToPage } from './index.js';
import { addToShoppingCart, ShoppingCartProduct } from './shoppingcart.js';
export { makeProduct, makeProductCard, addProductToCart };

function makeProduct(product) {
    const prodCardTemplate = document.querySelector('#singleProductTemplate');
    const productPage = document.querySelector('#productPage');
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
    const productForm = productClone.querySelector(".product-form");
    const addToCart = productClone.querySelector(".add-to-cart-btn");
    const cartPage = productForm.querySelectorAll('[data-page]');

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
    // for (let crumb of crumbs){
    //     crumb.dataset.page = 
    // }
    breadcrumbs.textContent = `Browse > ${product.gender} > ${product.category} > ${product.name}`;
    breadcrumbs.setAttribute('data-page', 'browse');
    // breadcrumbs.addEventListener("click", () => { useGoToPage(crumbs) });
    breadcrumbs.addEventListener("click", () => { goToPage('browse') });
}

function attachRelated(product, parentTemplate) {
    const filteredCategory = products.filter(p =>
        p.category === product.category
        && p.name !== product.name);
    const randomCatEnd = Math.floor(Math.random() * filteredCategory.length);
    const randomCatStart = randomCatEnd > 2 ? randomCatEnd - 2 : 0
    const relatedCategory = filteredCategory.slice(randomCatStart, randomCatEnd);
    // relatedCategory.forEach(p => console.log(p));

    let filteredPrice = products.filter(p =>
    ((p.price >= product.price - (product.price * 0.1)
        && p.price <= product.price + (product.price * 0.1))
        && (p.name !== product.name)));
    filteredPrice = filteredPrice.filter(p => !relatedCategory.includes(p));
    // filteredPrice.forEach(p => console.log("Price: ", p.price, p.name));

    let randomPriceStart, randomPriceEnd;
    while (randomPriceStart === randomPriceEnd && randomPriceStart > (randomPriceEnd - 1)) {
        randomPriceStart = Math.floor(Math.random() * filteredPrice.length);
        randomPriceEnd = Math.floor(Math.random() * filteredPrice.length);
    }
    const relatedPrice = filteredPrice.slice(randomPriceStart, randomPriceEnd);

    // relatedPrice.forEach(p => console.log(p.price, p.name));

    // const relatedProducts = [...relatedCategory, ...relatedPrice];
    const prodCardTemplate = document.querySelector('#relatedTemplate');
    const relatedCategoryList = parentTemplate.querySelector('#relatedCategoryProducts');
    const relatedPriceList = parentTemplate.querySelector('#relatedPriceProducts');
    makeProductCard(prodCardTemplate, relatedCategoryList, relatedCategory.slice(0, 2));
    makeProductCard(prodCardTemplate, relatedPriceList, relatedPrice.slice(0, 2));
}


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

function addProductToCart(product, addToCart) {
    addToCart.addEventListener("click", () => {
        let cart = document.querySelector('#cart-count')
        const cartCount = Number(cart.dataset.cartcount) + Number(addToCart.dataset.quantity);
        cart.textContent = cartCount;
        cart.setAttribute('data-cartcount', cartCount);
        addToShoppingCart(new ShoppingCartProduct(product, addToCart.dataset.color, addToCart.dataset.size, addToCart.dataset.quantity));
    });
}