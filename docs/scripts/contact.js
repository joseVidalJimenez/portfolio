const form = document.getElementById('contactForm');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Validate email before proceeding
  const emailField = form.querySelector('input[name="email"]');
  if (!validateEmail(emailField.value)) {
    alert('Please enter a valid email address.');
    return;
  }

  const formData = new FormData(form);
  
  fetch('https://script.google.com/macros/s/AKfycbzNJy61gWrfFNBB_cZsK46YBzeQVDRN4V4pV7JkGulIUa_LfLUZ7mTF47BGjcZYIJejlA/exec', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    form.reset(); // Clear the form after successful submission
    alert('Form submitted successfully!');
    window.location.href = './thanktyoupage.html'; // Redirect to thank you page
  })
  .catch(error => {
    console.error('Error:', error);
    alert('There was an error submitting the form.');
  });
});

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

