// API Configuration
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let authToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    loadProducts();
});

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        updateUIForAuth();
    }
}

// Update UI for authenticated user
function updateUIForAuth() {
    if (currentUser) {
        document.getElementById('authLink').style.display = 'none';
        document.getElementById('profileLink').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('sellBtn').style.display = 'block';
        updateCartBadge();
        updateMessagesBadge();
    } else {
        document.getElementById('authLink').style.display = 'block';
        document.getElementById('profileLink').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('sellBtn').style.display = 'none';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation toggle
    document.getElementById('navToggle').addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });

    // Search
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Sell form
    document.getElementById('sellForm').addEventListener('submit', handleSellProduct);
    document.getElementById('productImages').addEventListener('change', previewImages);

    // Cart link
    document.getElementById('cartLink').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
            loadCart();
            showPage('cart');
        } else {
            alert('Please login to view your cart');
            showPage('login');
        }
    });

    // Messages link
    document.getElementById('messagesLink').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
            loadMessages();
            showPage('messages');
        } else {
            alert('Please login to view messages');
            showPage('login');
        }
    });

    // Profile link
    document.getElementById('profileLink').addEventListener('click', (e) => {
        e.preventDefault();
        loadProfile();
        showPage('profile');
    });
}

// Show page
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const page = document.getElementById(`${pageName}Page`);
    if (page) {
        page.classList.add('active');
    }

    // Load data for specific pages
    if (pageName === 'products') {
        loadProducts();
    }
}

// API calls
async function apiCall(endpoint, options = {}) {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        }
    };

    if (authToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        alert(error.message);
        throw error;
    }
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        updateUIForAuth();
        showPage('home');
        alert('Login successful!');
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        updateUIForAuth();
        showPage('home');
        alert('Registration successful!');
    } catch (error) {
        console.error('Registration error:', error);
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateUIForAuth();
    showPage('home');
    alert('Logged out successfully');
}

// Products
async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const params = new URLSearchParams();
        const category = document.getElementById('categoryFilter')?.value;
        const size = document.getElementById('sizeFilter')?.value;
        const gender = document.getElementById('genderFilter')?.value;
        const condition = document.getElementById('conditionFilter')?.value;
        const sort = document.getElementById('sortFilter')?.value;
        const search = document.getElementById('searchInput')?.value;

        if (category) params.append('category', category);
        if (size) params.append('size', size);
        if (gender) params.append('gender', gender);
        if (condition) params.append('condition', condition);
        if (sort) params.append('sort', sort);
        if (search) params.append('search', search);

        const products = await apiCall(`/products?${params.toString()}`);

        if (products.length === 0) {
            grid.innerHTML = '<div class="loading">No products found</div>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card" onclick="viewProduct('${product.id}')">
                <img src="${product.images[0] || 'https://via.placeholder.com/300x250?text=No+Image'}"
                     alt="${product.title}" class="product-image">
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-meta">
                        <span class="product-tag">${product.size}</span>
                        <span class="product-tag">${product.gender}</span>
                        <span class="product-tag">${product.condition}</span>
                    </div>
                    <div class="product-actions" onclick="event.stopPropagation()">
                        <button class="btn-favorite ${product.favorites?.includes(currentUser?.id) ? 'active' : ''}"
                                onclick="toggleFavorite('${product.id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn-add-cart" onclick="addToCart('${product.id}')">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        grid.innerHTML = '<div class="loading">Error loading products</div>';
    }
}

async function viewProduct(productId) {
    showPage('productDetail');
    const detail = document.getElementById('productDetail');
    detail.innerHTML = '<div class="loading">Loading product details...</div>';

    try {
        const product = await apiCall(`/products/${productId}`);
        await apiCall(`/products/${productId}/view`, { method: 'POST' });

        const seller = await apiCall(`/users/${product.sellerId}`);

        detail.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-content">
                    <div class="product-gallery">
                        <img src="${product.images[0] || 'https://via.placeholder.com/400?text=No+Image'}"
                             alt="${product.title}" class="product-main-image" id="mainImage">
                        ${product.images.length > 1 ? `
                            <div class="product-thumbnails">
                                ${product.images.map((img, i) => `
                                    <img src="${img}" class="thumbnail ${i === 0 ? 'active' : ''}"
                                         onclick="changeMainImage('${img}', this)">
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div>
                        <h1>${product.title}</h1>
                        <div class="product-price" style="font-size: 2rem; margin: 1rem 0;">$${product.price.toFixed(2)}</div>
                        <div class="product-meta" style="margin: 1rem 0;">
                            <span class="product-tag">${product.category}</span>
                            <span class="product-tag">${product.size}</span>
                            <span class="product-tag">${product.gender}</span>
                            <span class="product-tag">${product.condition}</span>
                        </div>
                        <p style="margin: 1rem 0; line-height: 1.6;">${product.description}</p>
                        <div class="seller-info">
                            <img src="${seller.avatar}" alt="${seller.name}" class="seller-avatar">
                            <div>
                                <div style="font-weight: bold;">${seller.name}</div>
                                <div style="font-size: 0.9rem; color: #666;">Seller</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            ${currentUser && currentUser.id !== product.sellerId ? `
                                <button class="btn btn-primary" onclick="addToCart('${product.id}')">
                                    <i class="fas fa-cart-plus"></i> Add to Cart
                                </button>
                                <button class="btn btn-outline" style="border: 2px solid var(--primary); color: var(--primary);"
                                        onclick="contactSeller('${product.sellerId}', '${product.id}')">
                                    <i class="fas fa-envelope"></i> Contact Seller
                                </button>
                            ` : ''}
                        </div>
                        <div style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                            <i class="fas fa-eye"></i> ${product.views || 0} views
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        detail.innerHTML = '<div class="loading">Error loading product details</div>';
    }
}

function changeMainImage(src, thumbnail) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

async function toggleFavorite(productId) {
    if (!currentUser) {
        alert('Please login to add favorites');
        showPage('login');
        return;
    }

    try {
        await apiCall(`/products/${productId}/favorite`, { method: 'POST' });
        loadProducts();
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
}

// Sell Product
function previewImages(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

async function handleSellProduct(e) {
    e.preventDefault();

    if (!currentUser) {
        alert('Please login to sell products');
        showPage('login');
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('productTitle').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('category', document.getElementById('productCategory').value);
    formData.append('size', document.getElementById('productSize').value);
    formData.append('gender', document.getElementById('productGender').value);
    formData.append('condition', document.getElementById('productCondition').value);

    const images = document.getElementById('productImages').files;
    Array.from(images).forEach(image => {
        formData.append('images', image);
    });

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to create product');
        }

        alert('Product listed successfully!');
        document.getElementById('sellForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        showPage('products');
    } catch (error) {
        console.error('Error creating product:', error);
        alert('Error listing product');
    }
}

// Cart
async function addToCart(productId) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        showPage('login');
        return;
    }

    try {
        await apiCall('/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        alert('Added to cart!');
        updateCartBadge();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

async function loadCart() {
    const content = document.getElementById('cartContent');
    content.innerHTML = '<div class="loading">Loading cart...</div>';

    try {
        const cart = await apiCall('/cart');

        if (!cart.items || cart.items.length === 0) {
            content.innerHTML = '<div class="loading">Your cart is empty</div>';
            return;
        }

        const total = cart.items.reduce((sum, item) => sum + (item.product?.price || 0), 0);

        content.innerHTML = `
            ${cart.items.map(item => item.product ? `
                <div class="cart-item">
                    <img src="${item.product.images[0] || 'https://via.placeholder.com/100'}"
                         alt="${item.product.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div style="font-weight: bold; font-size: 1.1rem;">${item.product.title}</div>
                        <div style="color: var(--primary); font-size: 1.2rem; margin: 0.5rem 0;">
                            $${item.product.price.toFixed(2)}
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <span class="product-tag">${item.product.size}</span>
                            <span class="product-tag">${item.product.condition}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="background: var(--danger);"
                            onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : '').join('')}
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div style="display: flex; justify-content: space-between; margin: 1rem 0; font-size: 1.3rem;">
                    <span>Total:</span>
                    <span style="color: var(--primary); font-weight: bold;">$${total.toFixed(2)}</span>
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="checkout()">
                    <i class="fas fa-check"></i> Proceed to Checkout
                </button>
            </div>
        `;
    } catch (error) {
        content.innerHTML = '<div class="loading">Error loading cart</div>';
    }
}

async function removeFromCart(itemId) {
    try {
        await apiCall(`/cart/items/${itemId}`, { method: 'DELETE' });
        loadCart();
        updateCartBadge();
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

async function updateCartBadge() {
    if (!currentUser) return;

    try {
        const cart = await apiCall('/cart');
        const badge = document.getElementById('cartBadge');
        badge.textContent = cart.items?.length || 0;
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}

function checkout() {
    alert('Checkout functionality coming soon! This would integrate with a payment provider.');
}

// Messages
async function loadMessages() {
    const list = document.getElementById('conversationsList');
    list.innerHTML = '<div class="loading">Loading conversations...</div>';

    try {
        const conversations = await apiCall('/messages/conversations');

        if (conversations.length === 0) {
            list.innerHTML = '<div style="padding: 1rem; text-align: center;">No messages yet</div>';
            return;
        }

        list.innerHTML = conversations.map(conv => `
            <div class="conversation-item" onclick="loadConversation('${conv.partnerId}')">
                <img src="${conv.partner?.avatar || 'https://via.placeholder.com/40'}"
                     style="width: 40px; height: 40px; border-radius: 50%;">
                <div style="flex: 1;">
                    <div style="font-weight: bold;">${conv.partner?.name || 'Unknown'}</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">
                        ${conv.lastMessage.content.substring(0, 30)}...
                    </div>
                </div>
                ${conv.unreadCount > 0 ? `<span class="badge">${conv.unreadCount}</span>` : ''}
            </div>
        `).join('');

        updateMessagesBadge();
    } catch (error) {
        list.innerHTML = '<div style="padding: 1rem;">Error loading conversations</div>';
    }
}

async function loadConversation(userId) {
    const thread = document.getElementById('messageThread');
    thread.innerHTML = '<div class="loading">Loading messages...</div>';

    try {
        const messages = await apiCall(`/messages/${userId}`);
        const partner = await apiCall(`/users/${userId}`);

        thread.innerHTML = `
            <div style="border-bottom: 1px solid var(--light); padding-bottom: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${partner.avatar}" style="width: 50px; height: 50px; border-radius: 50%;">
                    <div style="font-weight: bold; font-size: 1.2rem;">${partner.name}</div>
                </div>
            </div>
            <div class="messages-list">
                ${messages.map(msg => `
                    <div class="message ${msg.senderId === currentUser.id ? 'sent' : 'received'}">
                        ${msg.content}
                        <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.3rem;">
                            ${new Date(msg.createdAt).toLocaleString()}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="message-input">
                <input type="text" id="messageInput" placeholder="Type a message...">
                <button class="btn btn-primary" onclick="sendMessage('${userId}')">
                    <i class="fas fa-paper-plane"></i> Send
                </button>
            </div>
        `;

        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage(userId);
        });
    } catch (error) {
        thread.innerHTML = '<div style="padding: 1rem;">Error loading conversation</div>';
    }
}

async function sendMessage(receiverId) {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();

    if (!content) return;

    try {
        await apiCall('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiverId, content })
        });

        input.value = '';
        loadConversation(receiverId);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function contactSeller(sellerId, productId) {
    if (!currentUser) {
        alert('Please login to contact sellers');
        showPage('login');
        return;
    }

    const message = prompt('Enter your message to the seller:');
    if (!message) return;

    try {
        await apiCall('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiverId: sellerId, content: message, productId })
        });

        alert('Message sent!');
        showPage('messages');
        loadMessages();
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function updateMessagesBadge() {
    if (!currentUser) return;

    try {
        const conversations = await apiCall('/messages/conversations');
        const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
        const badge = document.getElementById('messagesBadge');
        badge.textContent = unreadCount;
    } catch (error) {
        console.error('Error updating messages badge:', error);
    }
}

// Profile
async function loadProfile() {
    const content = document.getElementById('profileContent');
    content.innerHTML = '<div class="loading">Loading profile...</div>';

    try {
        const profile = await apiCall('/users/profile');
        const products = await apiCall(`/users/${profile.id}/products`);

        content.innerHTML = `
            <div class="product-detail">
                <div style="display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem;">
                    <img src="${profile.avatar}" style="width: 100px; height: 100px; border-radius: 50%;">
                    <div>
                        <h2>${profile.name}</h2>
                        <p>${profile.email}</p>
                        <p style="color: #666;">Member since ${new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <h3>My Listings (${products.length})</h3>
                <div class="products-grid">
                    ${products.length === 0 ? '<p>No products listed yet</p>' : products.map(product => `
                        <div class="product-card" onclick="viewProduct('${product.id}')">
                            <img src="${product.images[0] || 'https://via.placeholder.com/300x250'}"
                                 alt="${product.title}" class="product-image">
                            <div class="product-info">
                                <div class="product-title">${product.title}</div>
                                <div class="product-price">$${product.price.toFixed(2)}</div>
                                <div class="product-tag">${product.status}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        content.innerHTML = '<div class="loading">Error loading profile</div>';
    }
}

// Filters
function applyFilters() {
    loadProducts();
}

function filterProducts(type, value) {
    if (type === 'category') {
        document.getElementById('categoryFilter').value = value;
    }
    showPage('products');
    loadProducts();
}

function handleSearch() {
    showPage('products');
    loadProducts();
}
