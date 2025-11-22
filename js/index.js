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

    const prodCardTemplate = document.querySelector('#productCard');
    const productGrid = document.querySelector('.products-grid');

    // Initial Fetch
    fetch('../data-pretty.json')
        .then(response => response.json())
        .then(data => {
            products.push(...data)
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
        })
        .catch(error => {
            console.error('There was an error', error);
        });

    // products.forEach(p => {console.log(p.id)})

});

document.addEventListener('click', (e) => {
    if (!e.nodeName === "BUTTON") return;

})

async function getProducts() {

}

async function getSingleProduct() {

}