const API_URL = '/api/watches';
let watches = [];
let editingWatchId = null;

// DOM Elements
const watchesGrid = document.getElementById('watchesGrid');
const addWatchBtn = document.getElementById('addWatchBtn');
const watchModal = document.getElementById('watchModal');
const watchForm = document.getElementById('watchForm');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const modalTitle = document.getElementById('modalTitle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadWatches();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    addWatchBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => closeModalDialog());
    cancelBtn.addEventListener('click', () => closeModalDialog());
    watchForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    
    window.addEventListener('click', (e) => {
        if (e.target === watchModal) {
            closeModalDialog();
        }
    });
}

// Load watches from API
async function loadWatches() {
    try {
        watchesGrid.innerHTML = '<div class="loading">Loading watches</div>';
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to load watches');
        watches = await response.json();
        displayWatches(watches);
        updateStats();
    } catch (error) {
        console.error('Error loading watches:', error);
        watchesGrid.innerHTML = '<div class="empty-state"><h3>Error loading watches</h3><p>Please try again later.</p></div>';
    }
}

// Display watches
function displayWatches(watchesToDisplay) {
    if (watchesToDisplay.length === 0) {
        watchesGrid.innerHTML = '<div class="empty-state"><h3>No watches found</h3><p>Add your first mechanical watch to get started!</p></div>';
        return;
    }

    watchesGrid.innerHTML = watchesToDisplay.map(watch => `
        <div class="watch-card" data-id="${watch.id}">
            <img src="${watch.imageUrl}" alt="${watch.brand} ${watch.model}" class="watch-image">
            <div class="watch-content">
                <div class="watch-header">
                    <div class="watch-brand">${watch.brand}</div>
                    <div class="watch-model">${watch.model}</div>
                </div>
                
                <div class="watch-details">
                    <div class="watch-detail">
                        <span class="detail-label">Movement:</span>
                        <span class="detail-value">${watch.movement}</span>
                    </div>
                    <div class="watch-detail">
                        <span class="detail-label">Case:</span>
                        <span class="detail-value">${watch.caseMaterial}</span>
                    </div>
                    <div class="watch-detail">
                        <span class="detail-label">Dial:</span>
                        <span class="detail-value">${watch.dialColor}</span>
                    </div>
                </div>

                ${watch.description ? `<div class="watch-description">${watch.description}</div>` : ''}
                
                <div class="watch-price">$${watch.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                
                <div class="watch-quantity">
                    <label>Stock:</label>
                    <input type="number" min="0" value="${watch.quantity}" id="qty-${watch.id}">
                    <button onclick="updateQuantity(${watch.id})">Update</button>
                </div>
                
                <div class="watch-actions">
                    <button class="btn btn-secondary btn-small" onclick="editWatch(${watch.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteWatch(${watch.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const totalWatches = watches.length;
    const totalQuantity = watches.reduce((sum, watch) => sum + watch.quantity, 0);
    const totalValue = watches.reduce((sum, watch) => sum + (watch.price * watch.quantity), 0);

    document.getElementById('totalWatches').textContent = totalWatches;
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = watches.filter(watch => 
        watch.brand.toLowerCase().includes(searchTerm) ||
        watch.model.toLowerCase().includes(searchTerm) ||
        watch.movement.toLowerCase().includes(searchTerm) ||
        watch.caseMaterial.toLowerCase().includes(searchTerm) ||
        watch.dialColor.toLowerCase().includes(searchTerm) ||
        (watch.description && watch.description.toLowerCase().includes(searchTerm))
    );
    displayWatches(filtered);
}

// Modal functions
function openModal(watch = null) {
    editingWatchId = watch ? watch.id : null;
    modalTitle.textContent = watch ? 'Edit Watch' : 'Add New Watch';
    
    if (watch) {
        document.getElementById('brand').value = watch.brand;
        document.getElementById('model').value = watch.model;
        document.getElementById('movement').value = watch.movement;
        document.getElementById('caseMaterial').value = watch.caseMaterial;
        document.getElementById('dialColor').value = watch.dialColor;
        document.getElementById('price').value = watch.price;
        document.getElementById('quantity').value = watch.quantity;
        document.getElementById('description').value = watch.description || '';
        document.getElementById('imageUrl').value = watch.imageUrl || '';
    } else {
        watchForm.reset();
    }
    
    watchModal.style.display = 'block';
}

function closeModalDialog() {
    watchModal.style.display = 'none';
    watchForm.reset();
    editingWatchId = null;
}

// Form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const watchData = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        movement: document.getElementById('movement').value,
        caseMaterial: document.getElementById('caseMaterial').value,
        dialColor: document.getElementById('dialColor').value,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('quantity').value),
        description: document.getElementById('description').value,
        imageUrl: document.getElementById('imageUrl').value || 'https://via.placeholder.com/200x200?text=Watch'
    };

    try {
        const url = editingWatchId ? `${API_URL}/${editingWatchId}` : API_URL;
        const method = editingWatchId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(watchData)
        });

        if (!response.ok) throw new Error('Failed to save watch');

        closeModalDialog();
        await loadWatches();
    } catch (error) {
        console.error('Error saving watch:', error);
        alert('Failed to save watch. Please try again.');
    }
}

// Edit watch
function editWatch(id) {
    const watch = watches.find(w => w.id === id);
    if (watch) {
        openModal(watch);
    }
}

// Update quantity
async function updateQuantity(id) {
    const input = document.getElementById(`qty-${id}`);
    const quantity = parseInt(input.value);

    if (quantity < 0) {
        alert('Quantity cannot be negative');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}/quantity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) throw new Error('Failed to update quantity');

        await loadWatches();
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again.');
    }
}

// Delete watch
async function deleteWatch(id) {
    const watch = watches.find(w => w.id === id);
    if (!watch) return;

    if (!confirm(`Are you sure you want to delete ${watch.brand} ${watch.model}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete watch');

        await loadWatches();
    } catch (error) {
        console.error('Error deleting watch:', error);
        alert('Failed to delete watch. Please try again.');
    }
}
