// Знаходимо ВСІ форми з класом form
const forms = document.querySelectorAll(".form");

forms.forEach(function (form) {
  // В межах кожної конкретної форми шукаємо її власні поля по класу
  const phoneInput = form.querySelector(".input-tel");

  form.addEventListener("submit", function (e) {
    // --- Перевірка телефону ---
    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    if (phoneDigits.length < 12) {
      e.preventDefault();
      alert("Будь ласка, введіть повний номер телефону");
      return;
    }
  });
});