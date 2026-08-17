document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.form');
  const notify = document.getElementById('form-notify');

  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const pageUrlField = form.querySelector('[name="page_url"]');
      const timeOnPageField = form.querySelector('[name="time_on_page"]');
      if (pageUrlField) pageUrlField.value = window.location.href;
      if (timeOnPageField) timeOnPageField.value = Math.round(performance.now() / 1000);

      const formData = new FormData(form);

      try {
        const response = await fetch('telegram.php', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        showNotify(result.message, result.status);

        if (result.status === 'success') {
          form.reset();
        }
      } catch (err) {
        showNotify('Помилка з’єднання. Спробуйте ще раз.', 'error');
      }
    });
  });

  function showNotify(message, type) {
    if (!notify) return;
    notify.textContent = message;
    notify.className = `form-notify show ${type}`;

    setTimeout(() => {
      notify.classList.remove('show');
    }, 4000);
  }
});