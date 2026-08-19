document.addEventListener('DOMContentLoaded', () => {
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

  phoneLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const phoneNumber = link.getAttribute('href').replace('tel:', '');

      const formData = new FormData();
      formData.append('phone_clicked', phoneNumber);
      formData.append('page_url', window.location.href);

      // sendBeacon надійніше за fetch тут: браузер встигає
      // відправити запит навіть якщо сторінка одразу почне
      // переходити на набір номера
      if (navigator.sendBeacon) {
        navigator.sendBeacon('telegram-phone-click.php', formData);
      } else {
        fetch('telegram-phone-click.php', {
          method: 'POST',
          body: formData,
          keepalive: true,
        });
      }
      // клік по tel: спрацьовує сам собою, e.preventDefault() не потрібен
    });
  });
});