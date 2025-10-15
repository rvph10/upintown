// Newsletter form handler in footer

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.footer-newsletter-form');
  const input = document.querySelector('.footer-newsletter-input');
  const submitBtn = document.querySelector('.footer-newsletter-btn');

  if (!form || !input || !submitBtn) return;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation on input
  input.addEventListener('input', () => {
    // Remove error state on input
    input.classList.remove('error');
    const messageEl = document.querySelector('.footer-newsletter-message');
    if (messageEl && messageEl.classList.contains('error')) {
      messageEl.style.display = 'none';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = input.value.trim();

    // Validate empty field
    if (!email) {
      showMessage('Please enter your email address', 'error');
      input.classList.add('error');
      input.focus();
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      input.classList.add('error');
      input.focus();
      return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Successfully subscribed! Check your inbox', 'success');
        input.value = ''; // Clear input
        input.classList.remove('error');
      } else {
        // Handle specific error messages
        let errorMessage = 'Something went wrong. Please try again';

        if (data.error === 'Invalid email') {
          errorMessage = 'Please enter a valid email address';
          input.classList.add('error');
        } else if (data.error === 'Email already subscribed') {
          errorMessage = 'This email is already subscribed';
        } else if (data.error === 'Configuration error' || data.error === 'Subscription error') {
          errorMessage = 'Service temporarily unavailable. Please try again later';
        }

        showMessage(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      showMessage('Connection error. Please check your internet and try again', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });

  function showMessage(message, type) {
    // Create or get message container
    let messageEl = document.querySelector('.footer-newsletter-message');

    if (!messageEl) {
      messageEl = document.createElement('p');
      messageEl.className = 'footer-newsletter-message mono';
      form.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `footer-newsletter-message mono ${type}`;
    messageEl.style.display = 'block';

    // Hide after 6 seconds for success, 8 seconds for errors
    const hideDelay = type === 'success' ? 6000 : 8000;
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, hideDelay);
  }
});
