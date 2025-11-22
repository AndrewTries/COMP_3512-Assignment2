document.addEventListener('DOMContentLoaded', () => {
    const home = document.querySelector('article#home');
    const browse = document.querySelector('article#browse');
    const singleproduct = document.querySelector('article#singleproduct');
    const shoppingcart = document.querySelector('article#shoppingcart');
    const about = document.querySelector('dialog#about');

    // home.style.display = "none";
    browse.style.display = "none";
    singleproduct.style.display = "none";
    shoppingcart.style.display = "none";
    about.style.display = "none";

    const products = []

    document.querySelector('.cart-count').textContent = '1';

    const filter = document.querySelector('#filter');

    // Initial Fetch
    if (!checkIfFetched()) initialFetch();

    async function initialFetch() {
        try {
            const response = await fetch('../data-pretty.json')
            const data = await response.json();
            getFeatureProducts();
            products.push(...data)
            console.log("pushing")
        } catch (error) {
            console.error('There was an error', error);
        };
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



    const homeButtons = document.querySelectorAll('#homePage');
    homeButtons.forEach(h => {
        h.addEventListener('click', (e) => {
            // if (!e.nodeName === "BUTTON") return;
            goToPage(home);
        })
    })
    const browseButtons = document.querySelectorAll('#browsePage');
    const prodCardTemplate2 = document.querySelector('#browse #productCard');
    const productGrid2 = document.querySelector('#browse .products-grid');
    browseButtons.forEach(b => {
        b.addEventListener('click', (e) => {
            // if (!e.nodeName === "BUTTON") return;
            goToPage(browse);
            console.log(products)
            products.forEach(p => {
                const productClone2 = prodCardTemplate2.content.cloneNode(true);

                const img = productClone2.querySelector(".product-image");
                img.setAttribute("src", "images/kids_backpack.jpg");
                img.setAttribute("alt", p.name);

                const h3 = productClone2.querySelector(".product-name");
                h3.textContent = p.name;
                const price = productClone2.querySelector(".product-price");
                price.textContent = `$${p.price}`;

                productGrid2.appendChild(productClone2);
            })
        })
    })
    const productButtons = document.querySelectorAll('#productPage');
    productButtons.forEach(p => {
        p.addEventListener('click', (e) => {
            // if (!e.nodeName === "BUTTON") return;
            goToPage(singleproduct);
        })
    })
    const cartButtons = document.querySelectorAll('#cartPage');
    cartButtons.forEach(c => {
        c.addEventListener('click', (e) => {
            // if (!e.nodeName === "BUTTON") return;
            goToPage(shoppingcart);
        })
    })
    const aboutButtons = document.querySelectorAll('#aboutPage');
    aboutButtons.forEach(a => {
        a.addEventListener('click', (e) => {
            // if (!e.nodeName === "BUTTON") return;
            goToPage(about);
        })
    })

    const pages = [home, browse, singleproduct, shoppingcart, about];

    function goToPage(page) {
        pages.forEach(p => { p === page ? p.style.display = "" : p.style.display = "none"; })
    }

    function checkIfFetched() {
        console.log(products.length)
        return products.length !== 0 ? true : false;
    }

});


async function getFeatureProducts() {
    const prodCardTemplate = document.querySelector('#productCard');
    const productGrid = document.querySelector('.products-grid');
    for (let i = 0; i < 3; i++) {
        const productClone = prodCardTemplate.content.cloneNode(true);

        const img = productClone.querySelector(".product-image");
        img.setAttribute("src", "images/kids_backpack.jpg");
        img.setAttribute("alt", products[i].name);

        const h3 = productClone.querySelector(".product-name");
        h3.textContent = products[i].name;
        const price = productClone.querySelector(".product-price");
        price.textContent = `$${products[i].price}`;

        productGrid.appendChild(productClone);
    }
}

async function getProducts() {

}

async function getSingleProduct() {

}