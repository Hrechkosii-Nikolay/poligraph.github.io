const openModalBtns = document.querySelectorAll('[data-open-modal]');
const closeModalBtn = document.querySelector('[data-close-modal]');
const backdrop = document.querySelector('[data-backdrop]');

openModalBtns.forEach(openModalBtn => {
  openModalBtn.addEventListener('click', (e) => {
    e.preventDefault(); // блокує перехід за href="#"
    openModal();
  });
});

closeModalBtn.addEventListener('click', closeModal);

backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal();
});

function openModal() {
  backdrop.classList.remove('is-close');
  document.body.classList.add('body-no-scroll');
}

function closeModal() {
  backdrop.classList.add('is-close');
  document.body.classList.remove('body-no-scroll');
}