
import { getFeatureProducts } from './home.js'
import { getProducts, populateDepartements, sortOrder, resetFilter, setProducts } from './productSearch.js'
import { makeProduct } from './product.js';
import { writeCartPage, cartResults, clearCart } from './shoppingcart.js';
export { products, useGoToPage, goToPage };

let products = [];
const home = document.querySelector('article#home');
const browse = document.querySelector('article#browse');
const singleproduct = document.querySelector('article#singleproduct');
const shoppingcart = document.querySelector('article#shoppingcart');
const pages = [home, browse, singleproduct, shoppingcart];

function useGoToPage(buttonList) {
    buttonList.forEach(btn => {
        btn.addEventListener('click', () => goToPage(btn.dataset.page))
    })
}

function goToPage(page) {
    const curPage = document.querySelector(`article#${page}`);
    pages.forEach(p => { p === curPage ? p.style.display = "" : p.style.display = "none"; })
}

document.addEventListener('DOMContentLoaded', () => {

    browse.style.display = "none";
    singleproduct.style.display = "none";
    shoppingcart.style.display = "none";

    // Initial Fetch
    async function fetchProducts() {
        let cached = localStorage.getItem('products');
        if (cached) return JSON.parse(cached);
        console.log("fetching");
        const response = await fetch('../data-pretty.json')
        const data = await response.json();
        data.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem('products', JSON.stringify(data));
        return data;
    }

    fetchProducts().then(data => {
        products = data;
        setProducts(products);
        getFeatureProducts();
        populateDepartements();
        sortOrder();
        resetFilter();
        writeCartPage();
    })

    const navButtons = document.querySelectorAll('[data-page]');
    useGoToPage(navButtons);

    const dialog = document.querySelector("#about");
    const about = document.querySelector(".about")
    const aboutClose = document.querySelector("#aboutClose");

    about.addEventListener('click', () => dialog.showModal());
    aboutClose.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (e) => {
        if (dialog && e.target !== about && !onlyDialog.contains(e.target) && e.target !== onlyDialog) {
            dialog.close();
        }
    })
    function checkIfFetched() {
        return localStorage.products !== null ? true : false;
    }
});