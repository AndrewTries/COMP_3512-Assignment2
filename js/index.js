
import { getFeatureProducts } from './home.js'
import { getProducts, populateDepartements, sortOrder, resetFilter , setProducts} from './productSearch.js'
export { products };

let products = [];
document.addEventListener('DOMContentLoaded', () => {
    const home = document.querySelector('article#home');
    const browse = document.querySelector('article#browse');
    const singleproduct = document.querySelector('article#singleproduct');
    const shoppingcart = document.querySelector('article#shoppingcart');
    const about = document.querySelector('dialog#about');
    const pages = [home, browse, singleproduct, shoppingcart, about];

    browse.style.display = "none";
    singleproduct.style.display = "none";
    shoppingcart.style.display = "none";
    about.style.display = "none";
    


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
    })

    const navButtons = document.querySelectorAll('[data-page]');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = btn.dataset.page;
            console.log(page)
            goToPage(page);
        })
    })

    function goToPage(page) {
        const curPage = document.querySelector(`article#${page}`);
        pages.forEach(p => { p === curPage ? p.style.display = "" : p.style.display = "none"; })
    }

    function checkIfFetched() {
        return localStorage.products !== null ? true : false;
    }



    // async function makeProducts(productList, count, ) {
    //     for (let i = 0; i < count; i++) {
    //         const productClone = prodCardTemplate.content.cloneNode(true);

    //         const img = productClone.querySelector(".product-image");
    //         img.setAttribute("src", "images/kids_backpack.jpg");
    //         img.setAttribute("alt", productList[i].name);

    //         productClone.querySelector(".product-name").textContent = productList[i].name;
    //         productClone.querySelector(".product-price").textContent = `$${productList[i].price}`;
    //     }
    // }

    
        // const genders = products.map(product => product.gender);
        // const categories = products.map(product => product.category);
        // const sizes = products.map(product => product.sizes);
        // const colors = products.map(product => product.color);

        // const uniqueGenders = new Set(genders);
        // const uniqueCategories = new Set(categories);
        // const uniqueSizes = new Set(sizes);
        // const uniqueColors = new Set(colors);

        // const genderSelect = document.querySelector('#gender');
        // const categorySelect = document.querySelector('#category');
        // const sizeSelect = document.querySelector('#size');
        // const colorSelect = document.querySelector('#colours');

        // uniqueCategories.forEach(cat => {
        //     const opt = document.createElement('option');
        //     opt.value = cat;
        //     console.log(cat);
        //     opt.textContent = `${cat} (${categories.filter(c => c === cat).length})`;
        //     categorySelect.appendChild(opt)
        // });
        // document.querySelector('multiselect-dropdown');
    }

);


async function getSingleProduct() {

}


// async function initialFetch(){
//     fetch('../data-pretty.json')
//         .then(response => response.json())
//         .then(data => {
//             await getFeatureProducts();
//             products.push(...data)
//             console.log("pushing")

//         })
//         .catch(error => {
//             console.error('There was an error', error);
//         });
// }'

