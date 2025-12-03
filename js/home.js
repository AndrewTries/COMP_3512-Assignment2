import { products } from './index.js';
import { makeProduct, makeProductCard } from './product.js';
export async function getFeatureProducts() {
    const prodCardTemplate = document.querySelector('#featuredProductCard');
    const productGrid = document.querySelector('.products-grid');
    const top3 = products.sort((a, b) => b.sales.total - a.sales.total).slice(0, 3);
    console.log(top3)
    makeProductCard(prodCardTemplate, productGrid, top3);
}