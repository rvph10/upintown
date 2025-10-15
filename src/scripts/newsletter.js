// Newsletter form handler in footer

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.footer-newsletter-form');
  const input = document.querySelector('.footer-newsletter-input');
  const submitBtn = document.querySelector('.footer-newsletter-btn');

  if (!form || !input || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = input.value.trim();

    if (!email) {
      showMessage('Please enter your email', 'error');
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
        showMessage(data.message, 'success');
        input.value = ''; // Clear input
      } else {
        showMessage(data.error || 'An error occurred', 'error');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      showMessage('Connection error', 'error');
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

    // Hide after 5 seconds
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
});
