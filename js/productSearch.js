import { products } from './index.js';
export { getProducts, populateDepartements, sortOrder, resetFilter, setProducts };

let productList = []

async function setProducts (products) {
    productList = products.sort((a, b) => a.name.localeCompare(b.name));
    getProducts(productList);
}

async function getProducts(productList) {
    const prodCardTemplate2 = document.querySelector('#browse #productCard2');
    const productGrid2 = document.querySelector('#browse .products-grid');
    productGrid2.replaceChildren();
    if (!productList.length > 0) {
        productGrid2.textContent = "No products found";
        return;
    }

    productList.forEach(p => {
        const productClone2 = prodCardTemplate2.content.cloneNode(true);

        const img = productClone2.querySelector(".product-image");
        img.setAttribute("src", "images/kids_backpack.jpg");
        img.setAttribute("alt", p.name);

        productClone2.querySelector(".product-name").textContent = p.name;
        productClone2.querySelector(".product-price").textContent = `$${p.price}`;

        productGrid2.appendChild(productClone2);
    })
}



async function populateDepartements() {
    const selects = document.querySelectorAll('[data-select]');
    document.addEventListener('submit', e => {
        e.preventDefault();
    });
    selects.forEach(sel => {
        const select = sel.dataset.select;
        let options;
        if (select === 'sizes' || select == 'color') {
            options = products.map(product => [...product[select]]);
            options = options.flatMap(t => t);
        } else options = products.map(product => product[select]);
        // let uniqueOptions = new Set(options.sort((a,b) => a.localeCompare(b)));
        let uniqueOptions = new Set(options);
        let selected = document.querySelector(`select#${select}`);

        let count = {};
        options.forEach(o => count[o] = (count[o] || 0) + 1);
        // count = options.filter(c => c === cat).length;
        //https://codepen.io/nmcinteer/pen/owZoqe
        uniqueOptions.forEach(cat => {
            const opt = document.createElement('option');
            if (select === 'color') {
                opt.textContent = `${cat.name} ${cat.hex}`;
                opt.style.backgroundColor = cat.hex;

                // opt.classList.add('flex', 'gap-2');
                // opt.value = cat.hex;                    
                // const boxColor = document.createElement('div');
                // const text = document.createElement('div');                
                // boxColor.classList.add('h-4', 'w-4', 'rounded-sm', 'border-1', 'border-black');
                // boxColor.style.backgroundColor = cat.hex;
                // text.textContent = `${cat.name} ${cat.hex}`;
                // opt.appendChild(text);
                // opt.appendChild(boxColor);
            }
            else { opt.value = cat; opt.textContent = `${cat} (${count[cat]})`; }
            selected.appendChild(opt);
        })
        console.log("sel", sel)
        sel.addEventListener('change', (e) => { handleSelectProductChange(e, select) });
    });
}

/**
 * 
 * @param {*} e 
 * @param {*} products 
 */
function handleSelectProductChange(e, select) {
    console.log("select", select)
    console.log(e)
    const selectID = e.target.value;
    console.log(selectID);
    const filtered = products.filter(p => p[select] == selectID)
    productList = filtered;
    getProducts(filtered);
}   

function sortOrder() {
    const sortSelect = document.querySelector("#sortOrder")
    sortSelect.addEventListener('change', e => {
        const sortValue = e.target.value;
        console.log(sortValue)
        let sortedProducts;
        sortValue == 'price'
            ? sortedProducts = products.sort((a, b) => b[sortValue] - a[sortValue])
            : sortedProducts = products.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
        console.log(sortedProducts)
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


