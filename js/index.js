document.addEventListener('DOMContentLoaded', () => {
    const home = document.querySelector('article#home');
    const browse = document.querySelector('article#browse');
    const singleproduct = document.querySelector('article#singleproduct');
    const shoppingcart = document.querySelector('article#shoppingcart');
    const about = document.querySelector('dialog#about');
    const pages = [home, browse, singleproduct, shoppingcart, about];

    // home.style.display = "none";
    browse.style.display = "none";
    singleproduct.style.display = "none";
    shoppingcart.style.display = "none";
    about.style.display = "none";


    let products = [];

    // Initial Fetch
    async function fetchProducts() {
        let cached = localStorage.getItem('products');
        if (cached) return JSON.parse(cached);
        // return JSON.parse(localStorage.getItem('products')) || initialFetch();
        const response = await fetch('../data-pretty.json')
        const data = await response.json();
        localStorage.setItem('products', JSON.stringify(data));
        return data;
    }

    fetchProducts().then(data => {
        products = data;
        getFeatureProducts();
        getProducts();
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

    async function getFeatureProducts() {
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

    async function getProducts() {
        const prodCardTemplate2 = document.querySelector('#browse #productCard2');
        const productGrid2 = document.querySelector('#browse .products-grid');
        populateDepartements();
        products.forEach(p => {
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

            count = {};
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
                else {opt.value = cat; opt.textContent = `${cat} (${count[cat]})`;}
                selected.appendChild(opt);
            })
            sel.addEventListener('change', () => {

            });
        });
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

});





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
// }