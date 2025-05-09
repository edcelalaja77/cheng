const editConfirmBtn = document.getElementById("editConfirmBtn");
const confirmedInput = document.getElementById("confirmedInput");
const checkoutBtn = document.getElementById("checkoutBtn");
const confirmBtn = document.getElementById("confirmBtn");
const manualSaveBtn = document.getElementById("manualSaveBtn");
const resetBtn = document.getElementById("resetBtn");

document.addEventListener("DOMContentLoaded", () => {
  const provinceSelect = document.getElementById("provinceSelect");
  const citySelect = document.getElementById("citySelect");
  const barangaySelect = document.getElementById("barangaySelect");

  const addressData = {
    "Metro Manila": {
      "Quezon City": ["Matandang Balara", "Holy Spirit", "Bagumbayan", "Commonwealth", "Batasan Hills", "Novaliches", "Cubao", "Fairview"],
      "Manila": ["Tondo", "Sampaloc", "Ermita", "Malate", "Quiapo", "Paco", "Santa Cruz"],
      "Makati": ["Poblacion", "San Lorenzo", "Bel-Air", "Guadalupe Viejo", "Barangay Bangkal"]
    },
    "Cebu": {
      "Cebu City": ["Lahug", "Mabolo", "Banilad", "Guadalupe", "Capitol Site", "Kamputhaw"],
      "Mandaue City": ["Subangdaku", "Banilad", "Tipolo", "Alang-Alang", "Ibabao-Estancia"],
      "Lapu-Lapu City": ["Pusok", "Basak", "Maribago", "Gun-ob"]
    },
    "Davao": {
      "Davao City": ["Buhangin", "Talomo", "Agdao", "Baguio", "Tugbok", "Sasa", "Toril"],
      "Panabo City": ["Gredu", "San Francisco", "New Visayas", "San Pedro"]
    },
    "Laguna": {
      "Calamba": ["Canlubang", "Real", "Parian", "Barangay 1", "Barangay 2"],
      "San Pedro": ["United Bayanihan", "San Antonio", "San Vicente", "Magsaysay", "Pacita"]
    },
    "Batangas": {
      "Lipa City": ["Sabang", "Mataas na Lupa", "Santo Toribio", "Balintawak"],
      "Batangas City": ["Poblacion", "Alangilan", "Bolbok", "Sta. Rita"]
    },
    "Pampanga": {
      "San Fernando": ["San Agustin", "Del Pilar", "Sto. Rosario", "Dolores"],
      "Angeles City": ["Balibago", "Pulung Maragul", "Malabanias", "Cutcut"]
    },
    "Iloilo": {
      "Iloilo City": ["Jaro", "La Paz", "Mandurriao", "Molo", "City Proper"],
      "Oton": ["Poblacion East", "San Nicolas", "Trapiche", "Cabanbanan"]
    },
    "Baguio": {
      "Baguio City": ["Loakan", "Burnham-Legarda", "Aurora Hill", "Magsaysay", "Camdas"]
    }
  };

  Object.keys(addressData).forEach(province => {
    const option = document.createElement("option");
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });

  provinceSelect.addEventListener("change", () => {
    const selectedProvince = provinceSelect.value;
    citySelect.innerHTML = '<option value="">Select City</option>';
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';

    if (selectedProvince && addressData[selectedProvince]) {
      Object.keys(addressData[selectedProvince]).forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  });

  citySelect.addEventListener("change", () => {
    const selectedProvince = provinceSelect.value;
    const selectedCity = citySelect.value;
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';

    if (selectedProvince && selectedCity && addressData[selectedProvince][selectedCity]) {
      addressData[selectedProvince][selectedCity].forEach(barangay => {
        const option = document.createElement("option");
        option.value = barangay;
        option.textContent = barangay;
        barangaySelect.appendChild(option);
      });
    }
  });
});

editConfirmBtn?.addEventListener("click", () => {
  const updated = confirmedInput.value.trim();
  if (updated.length > 10) {
    saveAddress(updated);
  } else {
    updateStatus("❌ Updated address seems incomplete.");
  }
});

const confirmedText = document.getElementById("confirmedText");
const statusMsg = document.getElementById("statusMsg");

checkoutBtn?.addEventListener("click", startCheckout);
confirmBtn?.addEventListener("click", validateAddress);
manualSaveBtn?.addEventListener("click", saveManual);
resetBtn?.addEventListener("click", resetCheckout);

function startCheckout() {
  updateStatus("📍 Attempting to detect your current location...");
  showLoader();

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  } else {
    updateStatus("❌ Your browser does not support geolocation.");
    hideLoader();
  }
}

function success(position) {
  const lat = position.coords.latitude.toFixed(5);
  const lon = position.coords.longitude.toFixed(5);

  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`)
    .then(res => res.json())
    .then(data => {
      const address = data.address;
      const fullAddress = `${address.road || "Unknown Road"}, ${address.suburb || address.village || "Unknown Area"}, ${address.city || address.town || address.municipality || "Unknown City"}, ${address.state || "Unknown State"}, ${address.country || "Unknown Country"}`;
      document.getElementById("addressInput").value = fullAddress;
      updateStatus("✅ Location detected!");
      show("detectedSection");
    })
    .catch(() => {
      const fallback = `Lat: ${lat}, Lon: ${lon}`;
      document.getElementById("addressInput").value = fallback;
      updateStatus("⚠️ Could not resolve full address. Coordinates shown instead.");
      show("detectedSection");
    })
    .finally(() => {
      hideLoader();
    });
}

function error(err) {
  hideLoader();
  updateStatus("❌ Location detection failed. Please enter your address manually.");
  document.getElementById("manualSection").scrollIntoView({ behavior: "smooth" });
}

function validateAddress() {
  const address = document.getElementById("addressInput").value.trim();
  if (address && address.length > 10) {
    saveAddress(address);
  } else {
    updateStatus("❌ Detected address seems incomplete. Please correct it or enter manually.");
  }
}

function saveManual() {
  const street = document.getElementById("manualInput").value.trim();
  const province = document.getElementById("provinceSelect").value;
  const city = document.getElementById("citySelect").value;
  const barangay = document.getElementById("barangaySelect").value;

  if (street.length < 5 || !province || !city || !barangay) {
    updateStatus("❌ Please complete all manual address fields.");
    return;
  }

  const fullAddress = `${street}, ${barangay}, ${city}, ${province}, Philippines`;
  console.log("Manual address to save:", fullAddress); // ✅ ADD THIS FOR DEBUGGING
  saveAddress(fullAddress);
}

function saveAddress(finalAddress) {
  updateStatus("");
  confirmedText.innerText = `📍 ${finalAddress}`;
  confirmedInput.value = finalAddress;
  show("confirmedSection");
  show("shippingSection");
  localStorage.setItem("savedAddress", finalAddress);

  const addressType = finalAddress.includes("Lat") && finalAddress.includes("Lon") ? "auto" : "manual";

  fetch('save_address.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `address=${encodeURIComponent(finalAddress)}&address_type=${addressType}`
  })
    .then(response => response.text())
    .then(data => console.log("Server response:", data))
    .catch(error => console.error("Backend save error:", error));

  showLoader();
  setTimeout(() => {
    const cost = calculateShippingCost(finalAddress);
    document.getElementById("shippingCost").innerText = `🚚 Estimated Shipping Cost: ₱${cost.toFixed(2)}`;
    hideLoader();
  }, 1000);
}

function calculateShippingCost(address) {
  if (address.includes("Lat") && address.includes("Lon")) {
    const lat = parseFloat(address.match(/Lat:\s*(-?\d+\.\d+)/)?.[1]) || 0;
    const lon = parseFloat(address.match(/Lon:\s*(-?\d+\.\d+)/)?.[1]) || 0;
    const manilaLat = 14.5995, manilaLon = 120.9842;
    const distance = Math.sqrt(Math.pow(lat - manilaLat, 2) + Math.pow(lon - manilaLon, 2)) * 111;
    return 50 + distance * 2;
  }
  return 99.00;
}

function updateStatus(message) {
  statusMsg.innerText = message;
}

function show(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function hide(id) {
  document.getElementById(id)?.classList.add("hidden");
}

function showLoader() {
  updateStatus("⏳ Processing...");
}

function hideLoader() {
  setTimeout(() => updateStatus(""), 500);
}

function resetCheckout() {
  localStorage.removeItem("savedAddress");
  location.reload();
}

const saved = localStorage.getItem("savedAddress");
if (saved) {
  saveAddress(saved);
}
