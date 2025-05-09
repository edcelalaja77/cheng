const products = [
    {
        id: 1,
        title: "Smartphone XYZ",
        price: 88.00,
        seller: "TechStore",
        description: "High-performance smartphone with advanced camera features",
        image: "https://via.placeholder.com/300x300?text=Smartphone",
        category: "Electronics"
    },
    {
        id: 2,
        title: "Running Shoes",
        price: 5.00,
        seller: "SportyGear",
        description: "Comfortable running shoes with cushioning technology",
        image: "https://via.placeholder.com/300x300?text=Running+Shoes",
        category: "Sports"
    },
    {
        id: 3,
        title: "Coffee Maker",
        price: 49.99,
        seller: "HomeGoods",
        description: "Programmable coffee maker with thermal carafe",
        image: "https://via.placeholder.com/300x300?text=Coffee+Maker",
        category: "Home & Kitchen"
    },
    {
        id: 4,
        title: "Dress Shirt",
        price: 10.90,
        seller: "FashionHouse",
        description: "Slim-fit button-down dress shirt",
        image: "https://via.placeholder.com/300x300?text=Dress+Shirt",
        category: "Fashion"
    },
    {
        id: 5,
        title: "Wireless Headphones",
        price: 4.00,
        seller: "AudioTech",
        description: "Noise-cancelling wireless headphones with long battery life",
        image: "https://via.placeholder.com/300x300?text=Headphones",
        category: "Electronics"
    },
    {
        id: 6,
        title: "Cookbook Collection",
        price: 9.09,
        seller: "BookWorld",
        description: "Collection of gourmet recipes from around the world",
        image: "https://via.placeholder.com/300x300?text=Cookbook",
        category: "Books"
    }
];

// Shopping cart array
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const cartCountDisplay = document.getElementById('cartCount');
const productModal = document.getElementById('productModal');
const closeProductModalBtn = document.getElementById('closeProductModal');
const productDetailsContainer = document.getElementById('productDetails');
const categoryTags = document.querySelectorAll('.category-tag');

// Display products in the grid
function displayProducts(productsToShow = products) {
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">₱${product.price.toFixed(2)}</p>
                <p class="product-seller">Sold by: ${product.seller}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        // Add click event to view product details
        productCard.querySelector('.product-image').addEventListener('click', () => {
            showProductDetails(product);
        });
        
        productCard.querySelector('.product-title').addEventListener('click', () => {
            showProductDetails(product);
        });
        
        // Add to cart functionality
        productCard.querySelector('.add-to-cart').addEventListener('click', (e) => {
            addToCart(product);
            e.stopPropagation();
        });
        
        productGrid.appendChild(productCard);
    });
}

// Show product details in modal
function showProductDetails(product) {
    productDetailsContainer.innerHTML = `
        <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
                <img src="${product.image}" alt="${product.title}" style="max-width: 100%;">
            </div>
            <div style="flex: 2;">
                <h2>${product.title}</h2>
                <p class="product-price">₱${product.price.toFixed(2)}</p>
                <p class="product-seller">Sold by: ${product.seller}</p>
                <p style="margin: 20px 0;">${product.description}</p>
                <button class="btn" onclick="addToCart({id: ${product.id}, title: '${product.title}', price: ${product.price}})">Add to Cart</button>
            </div>
        </div>
    `;
    
    productModal.style.display = 'flex';
}

// Close product details modal
closeProductModalBtn.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Add to cart functionality
function addToCart(product) {
    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }
    
    // Update cart count display
    updateCartCount();
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation
    alert(`${product.title} added to cart!`);
}

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountDisplay.textContent = totalItems;
}

// Search functionality
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
});

// Category filtering
categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const category = tag.textContent;
        
        if (category === 'All') {
            displayProducts();
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.category === category
        );
        
        displayProducts(filteredProducts);
    });
});

// Load cart from localStorage if available
window.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    
    // Display all products initially
    displayProducts();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
    sidebar.classList.toggle('hide');
  }
  
//  login form handler
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let storedUsername = localStorage.getItem("username");
        let storedPassword = localStorage.getItem("password");
  
 
        if (username !== "" && password !== "") {
            alert('Login successful!');
            window.location.href = 'market.html';
        } else {
          alert('Invalid username or password.');
        }
      });
    }
  });
