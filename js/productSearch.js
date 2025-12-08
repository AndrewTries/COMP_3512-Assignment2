import { products } from './index.js';
import { makeProductCard } from './product.js';
export { getProducts, populateDepartements, sortOrder, resetFilter, setProducts };

let productList = [];
let filterList = [];

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
        const button = document.querySelector(`#${select}-list`);
        button.addEventListener('click', () => {
            console.log("clicked")
            sel.classList.toggle('invisible')
        })


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
        let selected = document.querySelector(`ul#${select}`);



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
                colorIcon.addEventListener("click", () => {
                    colorIcon.classList.toggle('border-3')
                    addToCart.setAttribute('data-select', `${obj.hex}`)
                });
                catColor.appendChild(colorIcon);
            }
        } else uniqueOptions.forEach(cat => {
            const opt = document.createElement('li');
            [opt.value, opt.title] = cat;
            opt.classList.add('flex', 'flex-grow', 'justify-between', 'items-center', 'gap-2', 'rounded-sm', 'bg-card', 'p-2', 'hover:bg-sky-500', 'border');

            /* Make checkbox */
            const checkbox = document.createElement('span');
            checkbox.setAttribute('data-key', `${select}-${cat}`);
            checkbox.setAttribute('data-filter-category', select);
            checkbox.setAttribute('data-filter-value', cat);
            checkbox.classList.add('flex', 'h-4', 'rounded-sm', 'aspect-square', 'justify-center', 'items-center', 'border', 'hover:cursor-pointer');

            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                checkbox.classList.toggle('bg-sky-700')
                checkbox.textContent === 'x' ? checkbox.textContent = '' : checkbox.textContent = 'x';
                let filterItem = { category: select, value: cat };

                /* If filter item is found in filterList remove it */
                if (filterList.find(f => f.category === filterItem.category && f.value === filterItem.value)) {
                    filterList.splice(filterList.indexOf(cat), 1);
                    getProducts(productList);
                } else filterList.push(filterItem);
                
                handleSelectProductChange();
            });

            const textbox = document.createElement('span');
            textbox.textContent = `${cat} (${count[cat]})`;

            const onlyOpt = document.querySelector(`#only${select}`)
            document.addEventListener('click', (e) => {
                if (!onlyOpt.contains(e.target) && e.target !== button) 
                    onlyOpt.classList.add('invisible');
            })

            opt.append(textbox, checkbox)

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
function handleSelectProductChange() {
    writeFilterElements();

    let filtered = [];

    products.filter(p => {
        filterList.forEach(f => {
            if(f.category == 'sizes') {
                const found = p[f.category].find(r => r === f.value);
                if (found) filtered.push(p);
            } else if (f.category == 'color') {
                const found = p[f.category].find(r => r.hex === f.value);
                if (found) filtered.push(p);
            }
            else if (p[f.category] === f.value) {
                filtered.push(p);
                // console.log("Passed: ", p)
            }
            p[f.category] === f.value;
        })
    })
    
    filtered.length === 0 ? productList = products : productList = filtered;
    console.log("fileredList", productList)
    getProducts(productList);
}

function writeFilterElements() {
    document.querySelector('#filterList').replaceChildren();
    const filterElements = document.querySelector('#filterList');
    filterList.forEach(f => {
        const filterEl = document.createElement('div');
        filterEl.setAttribute('data-key', `${f.category}-${f.value}`);;
        filterEl.textContent = f.value;
        filterEl.classList.add('flex', 'items-center', 'text-center', 'justify-center', 'h-7', 'pl-1', 'border', 'bg-card', 'rounded-sm');
        const removeEl = document.createElement('span');
        removeEl.textContent = 'x';
        removeEl.classList.add('flex', 'text-center', 'ml-2', 'items-center', 'size-4', 'm-1', 'justify-center', 'border', 'bg-button-bg', 'text-button-primary', 'rounded-sm', 'hover:cursor-pointer');
        removeEl.addEventListener('click', () => {
            const selectedFilter = document.querySelector(`[data-filter-category="${f.category}"][data-filter-value="${f.value}"]`);

            removeFilterSelect(selectedFilter);

            filterList.splice(filterList.indexOf(f), 1);
            filterElements.removeChild(filterEl);
            handleSelectProductChange();
        })
        filterEl.appendChild(removeEl);
        filterElements.appendChild(filterEl);
    })
}

function sortOrder() {
    const sortSelect = document.querySelector("#sortOrder")
    sortSelect.addEventListener('change', e => {
        const sortValue = e.target.value;
        let sortedProducts;
        sortValue == 'price'
            ? sortedProducts = productList.sort((a, b) => b[sortValue] - a[sortValue])
            : sortedProducts = productList.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
        getProducts(sortedProducts);
    });
}

function resetFilter() {
    const resetFilter = document.querySelector("#resetFilters");
    resetFilter.addEventListener('click', e => {
        const filter = document.querySelectorAll('[data-filter-category][data-filter-value]');
        filter.forEach(f => {
            removeFilterSelect(f);
        });
        document.querySelector('#filterList').replaceChildren();
        filterList.length = 0;
        productList = products;
        getProducts(productList);
    })
}

function removeFilterSelect(filterSelect) {
    if (filterSelect.dataset.category === 'color')
    filterSelect.classList.remove('bg-sky-700');
    filterSelect.textContent = '';
}