document.getElementById("shopForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const shopName = document.getElementById("shopName").value;
    const shopDesc = document.getElementById("shopDesc").value;
  
    if(shopName.trim() === "" || shopDesc.trim() === "") {
      alert("Please fill out all fields.");
      return;
    }
  
    // For now, we'll just save it in localStorage
    const shopData = {
      name: shopName,
      description: shopDesc
    };
  
    localStorage.setItem("myShop", JSON.stringify(shopData));
  
    alert("Shop created successfully!");
  
    // Redirect to marketplace homepage
    window.location.href = "store&product.html";
  });