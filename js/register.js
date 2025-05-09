document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    let username = document.getElementById("regUsername").value;
    let password = document.getElementById("regPassword").value;
    let confirmPassword = document.getElementById("regConfirmPassword").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    // Save account to localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
  
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
  });