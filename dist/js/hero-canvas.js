(function(){
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;
  let networkNodes = [], networkEdges = [], waveLines = [];

  function resize(){
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  /* ── НЕЙРОННА МЕРЕЖА (праворуч) ── */
  function buildNetwork(){
    networkNodes = [];
    networkEdges = [];

    for(let i = 0; i < 42; i++){
      const x = W * 0.72 + Math.random() * W * 0.34;
      const y = H * 0.04 + Math.random() * H * 0.92;
      networkNodes.push({
        x, y, baseX: x, baseY: y,
        r: 2.5 + Math.random() * 3.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.025,
        vx: (Math.random()-0.5) * 0.12,
        vy: (Math.random()-0.5) * 0.12,
      });
    }

    for(let i = 0; i < networkNodes.length; i++){
      for(let j = i+1; j < networkNodes.length; j++){
        const dx = networkNodes[i].x - networkNodes[j].x;
        const dy = networkNodes[i].y - networkNodes[j].y;
        if(Math.sqrt(dx*dx+dy*dy) < H*0.32) networkEdges.push([i,j]);
      }
    }
  }

  /* ── ХВИЛІ ПОЛІГРАФА ── */
  function buildWaves(){
    waveLines = [
      {y:0.30, amp:52, freq:0.105, speed:0.008, color:'rgba(255,255,255,0.55)'},
      {y:0.42, amp:24, freq:0.120, speed:0.005, color:'rgba(200,40,40,0.70)'},
      {y:0.54, amp:45, freq:0.098, speed:0.009, color:'rgba(255,255,255,0.45)'},
      {y:0.66, amp:30, freq:0.115, speed:0.002, color:'rgba(200,40,40,0.55)'},
    ];
  }

  function init(){
    buildNetwork();
    buildWaves();
  }

  /* ── РЕНДЕР ── */
  function draw(){
    ctx.clearRect(0,0,W,H);

    /* 1. Хвилі поліграфа — зсунуті на 35px вправо */
    const waveStartX = W*0.28 + 35;
    const waveEndX   = W*0.60 + 35;
    waveLines.forEach(ch => {
      ctx.beginPath();
      ctx.moveTo(waveStartX, H*ch.y);
      for(let x = waveStartX; x <= waveEndX; x += 2){
        const progress = (x - waveStartX)/(waveEndX - waveStartX);
        const wave1 = Math.sin(x*ch.freq + t*ch.speed) * ch.amp * progress;
        const wave2 = Math.sin(x*ch.freq*2.3 + t*ch.speed*1.4 + 1.2) * ch.amp*0.35 * progress;
        ctx.lineTo(x, H*ch.y + wave1 + wave2);
      }
      ctx.strokeStyle = ch.color;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    });

    /* 2. Рядки даних */
    ctx.font = '10px monospace';
    const dataRows = 14;
    const dataX = W*0.30;
    for(let i = 0; i < dataRows; i++){
      const dy = H*0.15 + i*(H*0.055);
      const flicker = 0.08 + 0.12*Math.sin(t*0.04 + i*0.7);
      ctx.fillStyle = i%3===1
        ? `rgba(200,40,40,${flicker+0.06})`
        : `rgba(180,180,180,${flicker})`;
      const seed = (i*137 + Math.floor(t*0.02)*31) & 0xffff;
      let row = '';
      for(let k=0;k<22;k++) row += String.fromCharCode(48 + ((seed*k*17+k*31)%42));
      ctx.fillText(row, dataX + (i%2)*8, dy);
      if(i%4===1){
        ctx.fillStyle = `rgba(200,40,40,${flicker*2})`;
        ctx.fillText('■ '+row.slice(0,6), dataX - 14, dy);
      }
    }

    /* 3. Нейронна мережа */
    networkNodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      n.vx += (n.baseX - n.x) * 0.0008;
      n.vy += (n.baseY - n.y) * 0.0008;
      n.vx *= 0.97; n.vy *= 0.97;
    });

    networkEdges.forEach(([a,b]) => {
      const na = networkNodes[a], nb = networkNodes[b];
      const dx = na.x-nb.x, dy = na.y-nb.y;
      const d  = Math.sqrt(dx*dx+dy*dy);
      const maxD = H*0.32;
      if(d > maxD) return;
      const alpha = (1 - d/maxD) * 0.6;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = `rgba(180,20,20,${alpha})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    networkNodes.forEach(n => {
      const pulse = 0.5 + 0.5*Math.sin(t*n.speed + n.phase);
      /* зовнішнє гало — розширюється при пульсі */
      const glowR = n.r * (4 + pulse * 5);
      const grd = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,glowR);
      grd.addColorStop(0,`rgba(220,30,30,${0.25 + pulse*0.45})`);
      grd.addColorStop(0.4,`rgba(180,10,10,${0.1 + pulse*0.2})`);
      grd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(n.x,n.y,glowR,0,Math.PI*2);
      ctx.fillStyle = grd;
      ctx.fill();
      /* ядро — змінює розмір */
      const coreR = n.r * (0.6 + pulse * 0.8);
      ctx.beginPath();
      ctx.arc(n.x,n.y,coreR,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,${40+Math.floor(pulse*60)},40,${0.7+pulse*0.3})`;
      ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();