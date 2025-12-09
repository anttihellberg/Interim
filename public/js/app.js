// Toast notification helper
function showToast(message, isError = false) {
  const toastEl = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  // Check if Bootstrap is available
  if (typeof bootstrap !== 'undefined') {
    const toast = new bootstrap.Toast(toastEl);
    toastMessage.textContent = message;
    toastEl.classList.toggle('bg-danger', isError);
    toastEl.classList.toggle('text-white', isError);
    toast.show();
  } else {
    // Fallback to console log if Bootstrap is not loaded
    console.log(isError ? 'Error: ' + message : message);
  }
}

// Update stats dynamically
async function updateStats() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    const statsCards = document.querySelectorAll('.stats-card h3');
    if (statsCards.length >= 3) {
      statsCards[0].textContent = totalProducts;
      statsCards[1].textContent = totalStock;
      statsCards[2].textContent = '$' + inventoryValue.toFixed(2);
    }
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// Update quantity
async function updateQuantity(id, newQuantity) {
  try {
    const response = await fetch(`/api/products/${id}/quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: parseInt(newQuantity) })
    });

    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }

    // Update badge color based on quantity
    const card = document.querySelector(`[data-product-id="${id}"]`);
    const badge = card.querySelector('.badge');
    badge.textContent = `Stock: ${newQuantity}`;
    
    // Update badge color
    badge.classList.remove('bg-success', 'bg-warning', 'bg-danger');
    if (newQuantity > 10) {
      badge.classList.add('bg-success');
    } else if (newQuantity > 5) {
      badge.classList.add('bg-warning');
    } else {
      badge.classList.add('bg-danger');
    }

    // Update stats without full page reload
    updateStats();

    showToast('Quantity updated successfully');
  } catch (error) {
    console.error('Error:', error);
    showToast('Failed to update quantity', true);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this watch?')) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    // Remove card from DOM with animation
    const card = document.querySelector(`[data-product-id="${id}"]`);
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      card.remove();
      updateStats(); // Update stats without full reload
    }, 300);

    showToast('Watch deleted successfully');
  } catch (error) {
    console.error('Error:', error);
    showToast('Failed to delete watch', true);
  }
}

// Add new product
document.getElementById('saveProductBtn')?.addEventListener('click', async () => {
  const form = document.getElementById('addProductForm');
  const formData = new FormData(form);
  
  const product = {
    name: formData.get('name'),
    brand: formData.get('brand'),
    description: formData.get('description'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity')) || 0,
    image_url: formData.get('image_url') || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop'
  };

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    showToast('Watch added successfully');
    
    // Close modal and reset form
    if (typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
      if (modal) modal.hide();
    }
    form.reset();

    // Reload page to show new product
    setTimeout(() => window.location.reload(), 500);
  } catch (error) {
    console.error('Error:', error);
    showToast('Failed to add watch', true);
  }
});

// Quantity button handlers
document.addEventListener('click', (e) => {
  if (e.target.closest('.quantity-btn')) {
    const btn = e.target.closest('.quantity-btn');
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
    let currentValue = parseInt(input.value);

    if (action === 'increase') {
      currentValue++;
    } else if (action === 'decrease' && currentValue > 0) {
      currentValue--;
    }

    input.value = currentValue;
    updateQuantity(id, currentValue);
  }

  if (e.target.closest('.delete-btn')) {
    const btn = e.target.closest('.delete-btn');
    const id = btn.dataset.id;
    deleteProduct(id);
  }
});

// Quantity input change handler
document.addEventListener('change', (e) => {
  if (e.target.classList.contains('quantity-input')) {
    const input = e.target;
    const id = input.dataset.id;
    let value = parseInt(input.value);

    if (isNaN(value) || value < 0) {
      value = 0;
      input.value = value;
    }

    updateQuantity(id, value);
  }
});

// Form validation
document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
});
