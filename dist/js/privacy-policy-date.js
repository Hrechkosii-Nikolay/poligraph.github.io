(() => {
  const updatedDate = document.querySelector('.policy-updated time');

  if (!updatedDate) return;

  const storageKey = 'privacy-policy-last-updated';
  const updateInterval = 3 * 24 * 60 * 60 * 1000;
  const initialDate = new Date(`${updatedDate.dateTime}T00:00:00`);
  const storedDate = localStorage.getItem(storageKey);
  const lastUpdate = storedDate ? new Date(storedDate) : initialDate;
  const now = new Date();

  const formatDate = (date) => new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  const displayDate = (now - lastUpdate >= updateInterval) ? now : lastUpdate;

  if (now - lastUpdate >= updateInterval) {
    localStorage.setItem(storageKey, now.toISOString());
  }

  updatedDate.dateTime = displayDate.toISOString().slice(0, 10);
  updatedDate.textContent = formatDate(displayDate);
})();
