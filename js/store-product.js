const productImage = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const dropText = document.getElementById('dropText');
const fileNameDisplay = document.getElementById('fileName');
const form = document.getElementById('productForm');
const notification = document.getElementById('notification');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

// Image preview functionality - keeping original code
productImage.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function() {
      imagePreview.src = reader.result;
      imagePreview.style.display = 'block';
      dropText.style.display = 'none';
      fileNameDisplay.textContent = file.name;
    };
    reader.readAsDataURL(file);
  }
});

// Enhanced: Drag and drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  imagePreviewContainer.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  imagePreviewContainer.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  imagePreviewContainer.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  imagePreviewContainer.style.borderColor = '#1c2896';
  imagePreviewContainer.style.backgroundColor = '#e8eeff';
}

function unhighlight() {
  imagePreviewContainer.style.borderColor = '#ccc';
  imagePreviewContainer.style.backgroundColor = '#f8f9fa';
}

imagePreviewContainer.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  
  if (files.length) {
    productImage.files = files;
    const event = new Event('change', { bubbles: true });
    productImage.dispatchEvent(event);
  }
}

// Form submission - preserving your core logic with enhancements
form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Validate inputs - keeping your validation logic
  const name = document.getElementById('productName').value.trim();
  const price = document.getElementById('price').value;
  const stock = parseInt(document.getElementById('stock').value);
  const category = document.getElementById('category').value;
  const imageFile = document.getElementById('productImage').files[0];

  if (!name || !price || !category || !imageFile) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  // Enhanced: Show loading state
  submitBtn.innerHTML = '<span class="loading"></span>Submitting...';
  submitBtn.disabled = true;

  const reader = new FileReader();
  reader.onload = function() {
    const imageData = reader.result;

    // Creating the product object - keeping your core data structure
    const productData = {
      id: Date.now(),
      name,
      price,
      stock,
      imageUrl: imageData,
      category,
      availability: document.getElementById('availability').checked,
      promoDetails: document.getElementById('promoDetails').value,
      status: "Pending",
      // Enhanced: Add timestamp
      createdAt: new Date().toISOString()
    };

    // Save to localStorage - keeping your storage logic
    try {
      let products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(productData);
      localStorage.setItem("products", JSON.stringify(products));
      
      showNotification('Product submitted successfully!', 'success');
      
      // Enhanced: Add delay for feedback before redirect
      setTimeout(() => {
        // Redirect to product list - keeping your navigation
        window.location.href = 'SPproduct-list.html';
      }, 1500); 
    } catch (error) {
      showNotification('Error saving product. Please try again.', 'error');
      submitBtn.innerHTML = 'Submit Product';
      submitBtn.disabled = false;
    }
  };

  reader.readAsDataURL(imageFile);
});

// Enhanced: Reset form functionality
if (resetBtn) {
  resetBtn.addEventListener('click', function() {
    form.reset();
    imagePreview.style.display = 'none';
    dropText.style.display = 'block';
    fileNameDisplay.textContent = '';
  });
}

// Enhanced: Show notification function
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

// Enhanced: Form field validation
const inputs = form.querySelectorAll('input[required], select[required]');
inputs.forEach(input => {
  input.addEventListener('blur', function() {
    if (!this.value.trim()) {
      this.style.borderColor = '#dc3545';
    } else {
      this.style.borderColor = '#120d88';
    }
  });
});

// Keeping your original tracking functionality
const statusSteps = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];
let currentStep = 0;

function trackOrder() {
  const input = document.getElementById("trackingInput")?.value;
  if (!input?.trim()) {
    alert("Please enter a tracking number.");
    return;
  }

  const orderStatus = document.getElementById("orderStatus");
  const statusText = document.getElementById("statusText");
  
  if (orderStatus && statusText) {
    orderStatus.classList.remove("hidden");
    statusText.innerText = statusSteps[currentStep];
  }
}

function updateStatus() {
  if (currentStep < statusSteps.length - 1) {
    currentStep++;
    const statusText = document.getElementById("statusText");
    const progressBar = document.getElementById("progressBar");
    
    if (statusText) {
      statusText.innerText = statusSteps[currentStep];
    }

    // Update progress bar width
    if (progressBar) {
      const progress = ((currentStep) / (statusSteps.length - 1)) * 100;
      progressBar.style.width = progress + "%";
    }
  }

  checkDeliveryStatus();
}

function checkDeliveryStatus() {
  const nextStatusBtn = document.getElementById("nextStatusBtn");
  const feedbackSection = document.getElementById("feedbackSection");
  
  if (statusSteps[currentStep] === "Delivered" && nextStatusBtn && feedbackSection) {
    nextStatusBtn.style.display = "none";
    feedbackSection.classList.remove("hidden");
  }
}

function submitFeedback() {
  const feedback = document.getElementById("feedback")?.value;
  const feedbackSection = document.getElementById("feedbackSection");
  
  if (feedback?.trim()) {
    alert("Thank you for your feedback!");
    if (feedbackSection) {
      feedbackSection.innerHTML = "<p>Feedback submitted ✅</p>";
    }
  } else {
    alert("Please enter your feedback.");
  }
}