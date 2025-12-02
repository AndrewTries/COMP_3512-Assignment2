import { products } from './index.js';
export async function getFeatureProducts() {
    const prodCardTemplate = document.querySelector('#productCard');
    const productGrid = document.querySelector('.products-grid');
    const top3 = products.sort((a, b) => b.sales.total - a.sales.total).slice(0, 3);
    console.log(top3)
    for (let i = 0; i < 3; i++) {
        const productClone = prodCardTemplate.content.cloneNode(true);

        const img = productClone.querySelector(".product-image");
        img.setAttribute("src", "images/kids_backpack.jpg");
        img.setAttribute("alt", top3[i].name);

        productClone.querySelector(".product-name").textContent = top3[i].name;
        productClone.querySelector(".product-price").textContent = `$${top3[i].price}`;

        productGrid.appendChild(productClone);
    }
}