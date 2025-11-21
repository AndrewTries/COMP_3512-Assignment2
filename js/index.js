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

    document.querySelector('.cart-count').textContent = '1';

    const filter = document.querySelector('#filter');

    const prodCardTemplate = document.querySelector('.product-card');
    const results = document.querySelector('#results');
    const clone = template.content.cloneNode(true);
    const productclone = clone.querySelector("")
    fetch('data-minified.json')
        .then(response => response.json())
        .then(data => {

        });
});

async function getProducts(){
    
}

async function getSingleProduct(){
    
}