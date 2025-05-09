function editField(field) {
  document.getElementById(`edit-${field}`).style.display = "block";
}

function cancelEdit(field) {
  document.getElementById(`edit-${field}`).style.display = "none";
}

function saveField(field) {
  const input = document.getElementById(`${field}-input`);
  const span = document.getElementById(`user-${field}`);
  if (input && span) {
    span.textContent = input.value;
  }
  cancelEdit(field);
}

function editShopeeInfo() {
  document.getElementById("shopee-edit-box").style.display = "block";
}

function cancelShopeeEdit() {
  document.getElementById("shopee-edit-box").style.display = "none";
}

function saveShopeeInfo() {
  document.getElementById("shopee-name").textContent = document.getElementById("shopee-name-input").value;
  document.getElementById("shopee-phone").textContent = document.getElementById("shopee-phone-input").value;
  document.getElementById("shopee-address").textContent = document.getElementById("shopee-address-input").value;
  cancelShopeeEdit();
}

function changeQty(amount) {
  const quantityInput = document.getElementById("quantity");
  let quantity = parseInt(quantityInput.value);
  quantity = Math.max(1, quantity + amount);
  quantityInput.value = quantity;
  updateTotal();
}

function applyShopeeVoucher() {
  const code = document.getElementById("shopee-voucher").value.trim().toUpperCase();
  const discountSpan = document.getElementById("code-discount");
  const msg = document.getElementById("shopee-voucher-msg");

  if (code === "50") {
    discountSpan.textContent = "50";
    msg.textContent = "Voucher applied successfully!";
  } else {
    discountSpan.textContent = "0";
    msg.textContent = "Invalid voucher code.";
  }

  updateTotal();
}

function deleteProduct() {
  const product = document.querySelector(".product");
  if (product) {
    product.remove();
    document.getElementById("item-price").textContent = "0";
    updateTotal();
  }
}

function updateTotal() {
  const price = parseInt(document.getElementById("item-price").textContent) || 0;
  const shipping = parseInt(document.getElementById("shipping-cost").textContent) || 0;
  const savings = parseInt(document.getElementById("discount-amount").textContent) || 0;
  const voucher = parseInt(document.getElementById("code-discount").textContent) || 0;

  const total = price + shipping - savings - voucher;
  document.getElementById("total").textContent = total;
}

function placeOrder() {
  alert("Order placed successfully!");
}