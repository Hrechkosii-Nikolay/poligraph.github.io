(() => {
  const phoneInputs = document.querySelectorAll('.input-tel');
  if (!phoneInputs.length) return;

  const maskOptions = { mask: '+{38} (\\000)000-00-00' };
  let loadPromise;

  const initializeMasks = () => {
    phoneInputs.forEach((input) => {
      if (input.dataset.maskReady === 'true') return;

      IMask(input, maskOptions);
      input.dataset.maskReady = 'true';
      input.addEventListener('input', () => {
        const value = input.value;
        if (!/^\+38\(0[0-9]/.test(value)) {
          input.value = value.replace(/^\+38\(0[^0-9]/, '+38(0');
        }
      });
    });
  };

  const loadMaskLibrary = () => {
    if (window.IMask) {
      initializeMasks();
      return Promise.resolve();
    }

    if (!loadPromise) {
      loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/js/imask.js?v=20260921-2';
        script.onload = () => {
          initializeMasks();
          resolve();
        };
        script.onerror = reject;
        document.head.append(script);
      });
    }

    return loadPromise;
  };

  phoneInputs.forEach((input) => {
    input.addEventListener('pointerdown', loadMaskLibrary, { once: true });
    input.addEventListener('focus', loadMaskLibrary, { once: true });
  });
})();
