import { products, useGoToPage } from './index.js';
import { makeProduct, makeProductCard } from './product.js';
export { getProducts, populateDepartements, sortOrder, resetFilter, setProducts };

let productList = []

async function setProducts(products) {
    productList = products.sort((a, b) => a.name.localeCompare(b.name));
    getProducts(productList);
}

async function getProducts(productList) {
    const prodCardTemplate = document.querySelector('#browseProductCard');
    const productGrid = document.querySelector('#browse .products-grid');
    productGrid.replaceChildren();
    if (!productList.length > 0) {
        productGrid.textContent = "No products found";
        return;
    }
    makeProductCard(prodCardTemplate, productGrid, productList);
}



async function populateDepartements() {
    const selects = document.querySelectorAll('[data-select]');
    document.addEventListener('submit', e => {
        e.preventDefault();
    });
    selects.forEach(sel => {
        const select = sel.dataset.select;
        let options;
        let uniqueOptions;
        if (select === 'sizes') {
            options = products.map(product => [...product[select]]).flatMap(t => t);
        } else if (select == 'color') {
            options = products.flatMap(product => product[select])
            uniqueOptions = new Map();
            options.forEach(o => uniqueOptions.set(o.hex, o));
            // if(uniqueOptions) console.log(uniqueOptions.forEach(u => console.log(u.hex, " ", u.name)))
        } else options = products.map(product => product[select]);
        if (select !== 'color') uniqueOptions = new Set(options);
        let selected = document.querySelector(`select#${select}`);

        let count = {};
        options.forEach(o => count[o] = (count[o] || 0) + 1);
        // count = options.filter(c => c === cat).length;
        //https://codepen.io/nmcinteer/pen/owZoqe
        const catColor = document.querySelector("#catColor");
        if (select === 'color') {
            for (let obj of uniqueOptions.values()) {
                const colorIcon = document.createElement('span');
                colorIcon.style.backgroundColor = `${obj.hex}`;
                colorIcon.title = obj.name;
                colorIcon.classList.add('h-4', 'rounded-sm', 'aspect-square', 'border-1', 'hover:cursor-pointer');
                colorIcon.addEventListener("click", () => addToCart.setAttribute('data-select', `${obj.hex}`));
                catColor.appendChild(colorIcon);
            }
        } else uniqueOptions.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = `${cat} (${count[cat]})`;
            opt.classList.add('h-4', 'rounded-sm', 'aspect-square', 'border-1', 'hover:cursor-pointer');
            opt.classList.add('flex', 'justify-between');
            selected.appendChild(opt);
        })
        sel.addEventListener('change', (e) => { handleSelectProductChange(e, select) });
    });
}

/**
 * 
 * @param {*} e 
 * @param {*} products 
 */
function handleSelectProductChange(e, select) {
    // console.log("select", select)
    // console.log(e)
    const selectID = e.target.value;
    // console.log(selectID);
    const filtered = products.filter(p => p[select] == selectID)
    productList = filtered;
    getProducts(filtered);
}

function sortOrder() {
    const sortSelect = document.querySelector("#sortOrder")
    sortSelect.addEventListener('change', e => {
        const sortValue = e.target.value;
        // console.log(sortValue)
        let sortedProducts;
        sortValue == 'price'
            ? sortedProducts = products.sort((a, b) => b[sortValue] - a[sortValue])
            : sortedProducts = products.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
        // console.log(sortedProducts)
        getProducts(sortedProducts);
    });
}

function resetFilter() {
    const resetFilter = document.querySelector("#resetFilters")
    resetFilter.addEventListener('click', e => {
        productList = products;
        getProducts(productList);
    })
}