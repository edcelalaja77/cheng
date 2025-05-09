const statusSteps = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];
let currentStep = 0;

function trackOrder() {
  const input = document.getElementById("trackingInput").value;
  if (!input.trim()) {
    alert("Please enter a tracking number.");
    return;
  }

  document.getElementById("orderStatus").classList.remove("hidden");
  document.getElementById("statusText").innerText = statusSteps[currentStep];
}

function updateStatus() {
    if (currentStep < statusSteps.length - 1) {
      currentStep++;
      document.getElementById("statusText").innerText = statusSteps[currentStep];
  
      // Update progress bar width
      const progress = ((currentStep) / (statusSteps.length - 1)) * 100;
      document.getElementById("progressBar").style.width = progress + "%";
    }
  
    if (statusSteps[currentStep] === "Delivered") {
      document.getElementById("nextStatusBtn").style.display = "none";
      document.getElementById("feedbackSection").classList.remove("hidden");
    }
  }
  

  if (statusSteps[currentStep] === "Delivered") {
    document.getElementById("nextStatusBtn").style.display = "none";
    document.getElementById("feedbackSection").classList.remove("hidden");
  }


function submitFeedback() {
  const feedback = document.getElementById("feedback").value;
  if (feedback.trim()) {
    alert("Thank you for your feedback!");
    document.getElementById("feedbackSection").innerHTML = "<p>Feedback submitted ✅</p>";
  } else {
    alert("Please enter your feedback.");
  }
}