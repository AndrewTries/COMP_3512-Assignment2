
import { getFeatureProducts } from './home.js'
import { populateDepartements, sortOrder, resetFilter, setProducts } from './productSearch.js';
import { writeCartPage } from './shoppingcart.js';
export { products, useGoToPage, goToPage };

/* main product array that is used following the initial fetch */
let products = [];
const home = document.querySelector('article#home');
const browse = document.querySelector('article#browse');
const singleproduct = document.querySelector('article#singleproduct');
const shoppingcart = document.querySelector('article#shoppingcart');
const pages = [home, browse, singleproduct, shoppingcart];

/* Helper functions to send button clicks to the various pages */
function useGoToPage(buttonList) {
    buttonList.forEach(btn => {
        btn.addEventListener('click', () => goToPage(btn.dataset.page))
    })
}

/* Sets page visability when page changed */
function goToPage(page) {
    const curPage = document.querySelector(`article#${page}`);
    pages.forEach(p => { p === curPage ? p.style.display = "" : p.style.display = "none"; })
}

document.addEventListener('DOMContentLoaded', () => {

    /* Link to retrieve data from */
    const apiLink = 'https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json'

    browse.style.display = "none";
    singleproduct.style.display = "none";
    shoppingcart.style.display = "none";

    /* Initial Data Fetch */
    async function fetchProducts() {
        /* Retrives from local storage if already fetched */
        let cached = localStorage.getItem('products');
        if (cached) return JSON.parse(cached);
        const absfilePath = import.meta.url;
        /* This resolved a github pages bug where it couldn't find the json file */
        // let filePath = absfilePath.replace(/js\/index.js$/, "");
        const response = await fetch(apiLink)
        const data = await response.json();
        data.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem('products', JSON.stringify(data));
        return data;
    }

    /* Executes all neccessary functions from various pages for the site to work */
    fetchProducts().then(data => {
        products = data;
        setProducts(products);
        getFeatureProducts();
        populateDepartements();
        sortOrder();
        resetFilter();
        writeCartPage();
    })

    /* Set up navigation buttons */
    const navButtons = document.querySelectorAll('[data-page]');
    useGoToPage(navButtons);

    const dialog = document.querySelector("#about");
    const about = document.querySelector(".about")
    const aboutClose = document.querySelector("#aboutClose");

    /* Adds click functionality so you can click off the about */
    about.addEventListener('click', () => dialog.showModal());
    aboutClose.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (e) => {
        if (dialog && e.target !== about && !onlyDialog.contains(e.target) && e.target !== onlyDialog) {
            dialog.close();
        }
    })

    /* Auto clicks the Switch Color button */
    // document.querySelector('#toggleLighting').click();
});