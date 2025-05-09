// Modal for modification reason input
function openModificationModal(productId, productName) {
  // Create modal if it doesn't exist
  let modal = document.getElementById("modificationModal");
  
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modificationModal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3>Request Modification</h3>
        <p class="product-name-display"></p>
        <div class="form-group">
          <label for="modificationReason">Reason for modification:</label>
          <textarea id="modificationReason" rows="4" placeholder="Please explain why this product needs modification..."></textarea>
        </div>
        <div class="modal-actions">
          <button id="submitModification" class="action-btn submit-btn">Submit Request</button>
          <button id="cancelModification" class="action-btn cancel-btn">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector(".close-modal").addEventListener("click", closeModificationModal);
    modal.querySelector("#cancelModification").addEventListener("click", closeModificationModal);
  }
  
  // Update modal content
  modal.querySelector(".product-name-display").textContent = `Product: ${productName}`;
  modal.querySelector("#modificationReason").value = "";
  
  // Set up submission handler
  const submitBtn = modal.querySelector("#submitModification");
  submitBtn.onclick = null; // Remove previous handlers
  submitBtn.addEventListener("click", function() {
    const reason = modal.querySelector("#modificationReason").value.trim();
    if (!reason) {
      alert("Please provide a reason for the modification request.");
      return;
    }
    
    // Process the modification request
    processModificationRequest(productId, reason);
    closeModificationModal();
  });
  
  // Display modal
  modal.style.display = "block";
}

// Close modification modal
function closeModificationModal() {
  const modal = document.getElementById("modificationModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Process the modification request
function processModificationRequest(productId, reason) {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    showNotification("Error: Product not found", "error");
    return;
  }
  
  // Update product status and reason
  products[productIndex].status = "Needs Modification";
  products[productIndex].modificationReason = reason;
  
  // Save changes
  if (saveProducts(products)) {
    showNotification("Modification request sent to the seller", "success");
    
    // Update UI without full page reload
    initializeProductList();
  } else {
    showNotification("Error saving changes. Please try again.", "error");
  }
}

// Display notification message
function showNotification(message, type = "info") {
  // Create notification container if it doesn't exist
  let notificationContainer = document.getElementById("notificationContainer");
  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.id = "notificationContainer";
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <span class="notification-close">&times;</span>
    </div>
  `;
  
  // Add close functionality
  notification.querySelector(".notification-close").addEventListener("click", function() {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
  
  // Add to container
  notificationContainer.appendChild(notification);
}

// Search functionality
function setupSearchFilter() {
  const searchInput = document.getElementById("productSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const searchTerm = this.value.toLowerCase();
      filterProducts(searchTerm);
    });
  }
}

// Filter products based on search term
function filterProducts(searchTerm) {
  const productCards = document.querySelectorAll(".product-card");
  
  productCards.forEach(card => {
    const productName = card.querySelector(".product-name").textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Filter products by status
function setupStatusFilter() {
  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", function() {
      const selectedStatus = this.value;
      filterProductsByStatus(selectedStatus);
    });
  }
}

// Filter products based on status
function filterProductsByStatus(status) {
  const productCards = document.querySelectorAll(".product-card");
  
  productCards.forEach(card => {
    if (status === "all" || card.classList.contains(`status-${status}`)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Initialize the app
function initApp() {
  // Load products
  initializeProductList();
  
  // Setup filters if they exist
  setupSearchFilter();
  setupStatusFilter();
  
  // Add event delegation for product actions
  document.addEventListener("click", function(event) {
    // Handle dynamic button clicks via delegation if needed
  });
}

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);

// Add event listener for storage changes (if multiple tabs are open)
window.addEventListener("storage", function(e) {
  if (e.key === "products") {
    initializeProductList();
  }
});