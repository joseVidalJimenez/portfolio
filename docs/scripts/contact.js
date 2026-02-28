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

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      form.reset();
      window.location.href = './thanktyoupage.html';
    } else {
      console.error('Submission error:', data);
      alert('There was an error submitting the form. Please try again.');
    }
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

