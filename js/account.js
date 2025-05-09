function showSection(id) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
  }
  
  function updateUsername() {
    const newName = document.getElementById('username-edit').value;
    if (newName.trim() !== "") {
      document.getElementById('username').textContent = newName;
      alert("Username updated!");
      document.getElementById('username-edit').value = '';
    }
  }
  
  document.getElementById('upload').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        document.getElementById('profile-pic').src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });
  