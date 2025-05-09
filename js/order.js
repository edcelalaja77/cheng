let trackingData = [];
let index = 0;

async function fetchTrackingData() {
  try {
    const response = await fetch("order.json");
    if (!response.ok) throw new Error("Network response was not ok");
    
    trackingData = await response.json();
    document.getElementById("tracking-id").textContent = trackingData.trackingId;
    updateStatus();
  } catch (err) {
    console.error("Failed to load tracking data:", err);
    document.querySelector('.tracker').innerHTML = `
      <h2>Error Loading Tracking Info</h2>
      <p>Please try again later.</p>
    `;
  }
}

function updateStatus() {
  const steps = trackingData.updates;
  if (!steps || index >= steps.length) return;

  const current = steps[index];

  document.getElementById('status').textContent = current.status;
  document.getElementById('location').textContent = current.location;
  document.getElementById('date').textContent = current.date;
  document.getElementById('time').textContent = current.time;

  const progressPercent = (index / (steps.length - 1)) * 100;
  document.getElementById('progress').style.width = `${progressPercent}%`;

  index++;

  if (index < steps.length) {
    setTimeout(updateStatus, 2000);
  } else {
    document.getElementById('complete-message').style.display = "block";
  }
}

fetchTrackingData();