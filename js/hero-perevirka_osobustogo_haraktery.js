(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 1800;
  const particles = [];

  function initParticles() {
    particles.length = 0;
    const cx = canvas.width  * 0.72;
    const cy = canvas.height * 0.50;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 60 + Math.random() * 340;
      particles.push({
        cx, cy,
        angle     : Math.random() * Math.PI * 2,
        radius,
        speed     : (0.00075 + Math.random() * 0.00125) * (radius < 180 ? 1.5 : 1),
        size      : Math.random() * 1.5 + 0.3,
        brightness: Math.random(),
        wave      : Math.random() * Math.PI * 2,
        waveAmp   : Math.random() * 18 + 4,
        waveSpeed : 0.0075 + Math.random() * 0.01,
      });
    }
  }
  initParticles();

  window.addEventListener('resize', initParticles);

  function draw() {
    const W  = canvas.width;
    const H  = canvas.height;
    const cx = W * 0.72;
    const cy = H * 0.50;

    ctx.clearRect(0, 0, W, H);

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.65);
    bg.addColorStop(0,   '#150000');
    bg.addColorStop(0.3, '#0a0000');
    bg.addColorStop(0.7, '#050000');
    bg.addColorStop(1,   '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.angle += p.speed;
      p.wave  += p.waveSpeed;

      const r = p.radius + Math.sin(p.wave) * p.waveAmp;
      const x = cx + Math.cos(p.angle) * r;
      const y = cy + Math.sin(p.angle) * r;

      if (x < 0 || x > W || y < 0 || y > H) return;

      const distNorm = p.radius / 340;
      const inner    = distNorm < 0.3;
      const red      = inner ? 255 : 200 + Math.floor(55 * p.brightness);
      const green    = inner ? Math.floor(60 * p.brightness) : Math.floor(30 * p.brightness);
      const alpha    = (0.4 + p.brightness * 0.6) * (distNorm < 0.5 ? 1 : 0.7);

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${red},${green},0,${alpha})`;
      ctx.fill();
    });

    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
    core.addColorStop(0,   'rgba(0,0,0,1)');
    core.addColorStop(0.7, 'rgba(0,0,0,0.95)');
    core.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 55, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    const fade = ctx.createLinearGradient(0, 0, W * 0.55, 0);
    fade.addColorStop(0,   'rgba(0,0,0,0.97)');
    fade.addColorStop(0.6, 'rgba(0,0,0,0.55)');
    fade.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  draw();
})();