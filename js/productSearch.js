import { products } from './index.js';
import { makeProductCard } from './product.js';
export { getProducts, populateDepartements, sortOrder, resetFilter, setProducts };

let productList = [];
let filterList = [];

/* Resets sort order of products, default is alphabetical */
async function setProducts(products) {
    productList = products.sort((a, b) => a.name.localeCompare(b.name));
    getProducts(productList);
}

/* Retrieves products in productList and calls the make product function */
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

/* Sets up the 4 filters for all categories */
async function populateDepartements() {
    const selects = document.querySelectorAll('[data-select]');
    document.addEventListener('submit', e => {
        e.preventDefault();
    });
    /* For each filter */
    selects.forEach(sel => {
        const select = sel.dataset.select;
        /* Changes filter visability */
        const button = document.querySelector(`#${select}-list`);
        button.addEventListener('click', () => {
            ("clicked")
            sel.classList.toggle('invisible')
        })

        /* Assigning the filter options to the filter drop downs */
        let options;
        let uniqueOptions;
        if (select === 'sizes') {
            options = products.map(product => [...product[select]]).flatMap(t => t);
        } else if (select == 'color') {
            options = products.flatMap(product => product[select])
            uniqueOptions = new Map();
            options.forEach(o => uniqueOptions.set(o.hex, o));
        } else options = products.map(product => product[select]);
        if (select !== 'color') uniqueOptions = new Set(options);
        let selected = document.querySelector(`ul#${select}`);


        /* Assigning a count for each filter option */
        let count = {};
        options.forEach(o => count[o] = (count[o] || 0) + 1);

        /* Referenced this when creating the drop downs */
        //https://codepen.io/nmcinteer/pen/owZoqe

        /* Building the color select drop down */ 
        const catColor = document.querySelector("#catColor");        
        if (select === 'color') {
            for (let obj of uniqueOptions.values()) {
                const colorIcon = document.createElement('span');
                colorIcon.style.backgroundColor = `${obj.hex}`;
                colorIcon.title = obj.name;
                colorIcon.setAttribute('data-key', `${select}-${obj.name}`);
                colorIcon.setAttribute('data-filter-category', select);
                colorIcon.setAttribute('data-filter-value', obj.name);
                colorIcon.classList.add('h-4', 'rounded-sm', 'aspect-square', 'border-1', 'hover:cursor-pointer');

                /* Actions on select toggle */
                colorIcon.addEventListener("click", (e) => {
                    e.stopPropagation();
                    colorIcon.classList.toggle('border-3');

                    let filterItem = { category: select, value: obj.name };
                    /* If filter item is found in filterList remove it */
                    handleFilterSelect(filterItem);
                });
                catColor.appendChild(colorIcon);
            }

            /* Building all other drop downs */
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

            /* Actions on select toggle */
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                checkbox.classList.toggle('bg-sky-700');
                checkbox.textContent === 'x' ? checkbox.textContent = '' : checkbox.textContent = 'x';
                let filterItem = { category: select, value: cat };
                /* If filter item is found in filterList remove it */
                handleFilterSelect(filterItem);
            });

            const textbox = document.createElement('span');
            textbox.textContent = `${cat} (${count[cat]})`;

            /* Default visibility is invisible */
            const onlyOpt = document.querySelector(`#only${select}`)
            document.addEventListener('click', (e) => {
                if (!onlyOpt.contains(e.target) && e.target !== button)
                    onlyOpt.classList.add('invisible');
            })

            opt.append(textbox, checkbox)
            selected.appendChild(opt);
        }) /* Calling function to manage filter updates */
        sel.addEventListener('change', (e) => { handleSelectProductChange(e, select) });
    });
}

/* If filter item is found in filterList remove it, other wise add it */
function handleFilterSelect(filterItem) {
    if (filterList.find(f => f.category === filterItem.category && f.value === filterItem.value)) {
        filterList.splice(filterList.indexOf(filterItem.value), 1);
        getProducts(productList);
    } else filterList.push(filterItem);

    handleSelectProductChange();
}

/**
 * Function to manage filter updates
 * @param {*} e 
 * @param {*} products 
 */
function handleSelectProductChange() {
    writeFilterElements();

    let filtered = [];
    /* operation managing what products are applied to the filter list */
    products.filter(p => {
        filterList.forEach(f => {
            if (f.category == 'sizes') {
                const found = p[f.category].find(r => r === f.value);
                if (found) filtered.push(p);
            } else if (f.category == 'color') {
                const found = p[f.category].find(r => r.name === f.value);
                if (found) filtered.push(p);
            }
            else if (p[f.category] === f.value)
                filtered.push(p);
            p[f.category] === f.value;
        })
    })

    /* If there are no filters, display full product list */
    filtered.length === 0 ? productList = products : productList = filtered;
    ("fileredList", productList)
    getProducts(productList);
}

/* Creates clearable filter list of filters that have been added */
function writeFilterElements() {
    document.querySelector('#filterList').replaceChildren();
    const filterElements = document.querySelector('#filterList');
    filterList.forEach(f => {
        const filterEl = document.createElement('div');
        filterEl.setAttribute('data-key', `${f.category}-${f.value}`);
        filterEl.textContent = f.value;
        filterEl.classList.add('flex', 'items-center', 'text-center', 'justify-center',
            'h-7', 'pl-1', 'border', 'bg-card', 'rounded-sm');
        const removeEl = document.createElement('span');
        removeEl.textContent = 'x';
        removeEl.classList.add('flex', 'text-center', 'ml-2', 'items-center', 'size-4', 'm-1',
            'justify-center', 'border', 'bg-button-bg', 'text-button-primary', 'rounded-sm', 'hover:cursor-pointer');
        removeEl.addEventListener('click', () => {
            const selectedFilter = document.querySelector(`[data-filter-category="${f.category}"][data-filter-value="${f.value}"]`);

            /* Clear filters */
            removeFilterSelect(selectedFilter);

            filterList.splice(filterList.indexOf(f), 1);
            filterElements.removeChild(filterEl);
            handleSelectProductChange();
        })
        filterEl.appendChild(removeEl);
        filterElements.appendChild(filterEl);
    })
}

/* Manages different sort order options */
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

/* Resets and clears all filters */
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
        setProducts(productList);
    })
}

/* Resets display properties of selected filters */
function removeFilterSelect(filterSelect) {
    const key = (filterSelect.dataset.key);
    if (key.includes('color')) {
        filterSelect.classList.remove('border-3');
    } else {
        filterSelect.classList.remove('bg-sky-700');
        filterSelect.textContent = '';
    }

}