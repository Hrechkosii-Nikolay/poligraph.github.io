const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

// The full stylesheets are applied asynchronously. Keep transitions disabled
// until then to avoid animating the initial style calculation for every card.
window.addEventListener('load', () => {
  requestAnimationFrame(() => document.body.classList.remove('is-loading'));
});

const lazyFrames = document.querySelectorAll('iframe[data-lazy-src]');

const loadFrame = (frame) => {
  frame.src = frame.dataset.lazySrc;
  frame.removeAttribute('data-lazy-src');
};

if ('IntersectionObserver' in window) {
  const frameObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadFrame(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '300px 0px' });

  lazyFrames.forEach((frame) => frameObserver.observe(frame));
} else {
  lazyFrames.forEach(loadFrame);
}

if (mainNav) {
  const submenuItems = mainNav.querySelectorAll('.menu-item.has-submenu');
  const locationsFooterLink = document.querySelector('.footer-item a[href="#locations"]');

  const closeSubmenus = () => {
    submenuItems.forEach((item) => {
      item.classList.remove('is-submenu-open');
      item.querySelector('.link').setAttribute('aria-expanded', 'false');
    });
  };

  const closeMenu = () => {
    mainNav.classList.remove('is-menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Відкрити меню');
    }
    closeSubmenus();
  };

  const openMenu = () => {
    mainNav.classList.add('is-menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Закрити меню');
    }
  };

  const openSubmenu = (item) => {
    closeSubmenus();
    item.classList.add('is-submenu-open');
    item.querySelector('.link').setAttribute('aria-expanded', 'true');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-menu-open');

      if (isOpen) {
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Закрити меню');
      } else {
        closeMenu();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  submenuItems.forEach((item) => {
    const link = item.querySelector('.link');

    link.setAttribute('aria-expanded', 'false');

    link.addEventListener('click', (event) => {
      if (!window.matchMedia('(max-width: 1199px)').matches) {
        return;
      }

      event.preventDefault();
      const isOpen = item.classList.contains('is-submenu-open');

      closeSubmenus();

      if (!isOpen) {
        openSubmenu(item);
      }
    });
  });

  if (locationsFooterLink) {
    locationsFooterLink.addEventListener('click', (event) => {
      if (!window.matchMedia('(max-width: 767px)').matches) {
        return;
      }

      event.preventDefault();
      openMenu();
      openSubmenu(document.getElementById('locations'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
