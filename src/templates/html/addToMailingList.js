document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('email');
  const message = document.getElementById('form-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = '';
    const email = emailInput.value;
    if (!email) return;
    try {
      await window.db.collection('mailingList').add({
        email,
        createdAt: new Date()
      });
      message.textContent = 'Thanks for subscribing!';
      message.style.color = 'green';
      emailInput.value = '';
    } catch (err) {
      message.textContent = 'Something went wrong. Please try again.';
      message.style.color = 'red';
    }
  });
}); 