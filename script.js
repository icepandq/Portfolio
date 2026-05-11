(function () {

  // ═══════════════════════════════════════════════════════
  // SHARED HELPERS
  // ═══════════════════════════════════════════════════════

  function shine(el, delay = 0, color = 'rgba(255,255,255,0.55)') {
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const w = document.createElement('div');
      w.style.cssText = `
        position:fixed; top:${r.top}px; left:${r.left}px;
        width:${r.width}px; height:${r.height}px;
        overflow:hidden; pointer-events:none; z-index:9999;
        border-radius:${getComputedStyle(el).borderRadius || '0px'};
      `;
      const beam = document.createElement('div');
      beam.style.cssText = `
        position:absolute; top:0; left:-100%; width:60%; height:100%;
        pointer-events:none;
        background:linear-gradient(105deg,transparent 20%,${color} 50%,transparent 80%);
      `;
      w.appendChild(beam);
      document.body.appendChild(w);
      const s = performance.now();
      (function step(n) {
        const p = Math.min((n - s) / 500, 1);
        const e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
        beam.style.left = `${-100 + e*200}%`;
        p < 1 ? requestAnimationFrame(step) : w.remove();
      })(performance.now());
    }, delay);
  }

  function glitchReveal(el, delay = 0) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transition = 'none';
    setTimeout(() => {
      const original = el.style.cssText;
      let count = 0;
      const glitchColors = ['#ff0','#ff0','#ff0','#fff'];
      const t = setInterval(() => {
        if (count % 2 === 0) {
          const tx = (Math.random() - 0.5) * 8;
          const c  = glitchColors[Math.floor(Math.random() * glitchColors.length)];
          el.style.opacity    = '0.7';
          el.style.transform  = `translateX(${tx}px) skewX(${tx}deg)`;
          el.style.filter     = `drop-shadow(0 0 6px ${c})`;
          el.style.color      = c;
        } else {
          el.style.opacity   = '0.4';
          el.style.transform = 'translateX(0)';
          el.style.filter    = 'none';
          el.style.color     = '';
        }
        count++;
        if (count >= 10) {
          clearInterval(t);
          el.style.opacity   = '1';
          el.style.transform = 'translateX(0)';
          el.style.filter    = 'none';
          el.style.color     = '';
        }
      }, 55);
    }, delay);
  }

  function scanReveal(el, delay = 0) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.clipPath = 'inset(0 100% 0 0)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `
        opacity 0.1s ease,
        clip-path 0.7s cubic-bezier(0.22,1,0.36,1)
      `;
      el.style.opacity  = '1';
      el.style.clipPath = 'inset(0 0% 0 0)';
      shine(el, 400);
    }, delay);
  }

  function fadeUp(el, delay = 0, duration = 700) {
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `
        opacity ${duration}ms cubic-bezier(0.22,1,0.36,1),
        transform ${duration}ms cubic-bezier(0.22,1,0.36,1)
      `;
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }

  function typewrite(el, delay = 2) {
    if (!el) return;
    el.querySelectorAll('span').forEach((span, si) => {
      const text = span.textContent;
      span.textContent = '';
      span.style.opacity = '1';
      setTimeout(() => {
        let i = 0;
        // Scramble effect before real characters appear
        const chars = '!<>-_\\/[]{}—=+*^?#@$%&';
        const scramble = setInterval(() => {
          span.textContent = text.slice(0, i)
            + chars[Math.floor(Math.random() * chars.length)]
            + chars[Math.floor(Math.random() * chars.length)];
        }, 40);
        setTimeout(() => {
          clearInterval(scramble);
          span.textContent = '';
          const t = setInterval(() => {
            span.textContent += text[i++];
            if (i >= text.length) clearInterval(t);
          }, 36);
        }, 260);
      }, delay + si * 180);
    });
  }

  function drawLine(el, delay = 0, finalWidth = '10vh') {
    if (!el) return;
    el.style.width   = '0';
    el.style.opacity = '0';
    el.style.boxShadow = '0 0 8px rgba(255,255,0,0.8)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `width 0.7s cubic-bezier(0.22,1,0.36,1),
                             opacity 0.3s ease,
                             box-shadow 1s ease`;
      el.style.opacity = '1';
      el.style.width   = finalWidth;
      setTimeout(() => {
        el.style.boxShadow = '0 0 4px rgba(255,255,0,0.3)';
      }, 800);
    }, delay);
  }

  function burst(el, color = 'rgba(255,255,0,0.9)') {
    const r  = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    for (let i = 0; i < 10; i++) {
      const dot   = document.createElement('div');
      const angle = (i / 10) * Math.PI * 2;
      const dist  = 24 + Math.random() * 22;
      const size  = 2 + Math.random() * 3;
      dot.style.cssText = `
        position:fixed; width:${size}px; height:${size}px;
        border-radius:50%; background:${color};
        left:${cx}px; top:${cy}px;
        pointer-events:none; z-index:9999;
      `;
      document.body.appendChild(dot);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const s  = performance.now();
      (function step(n) {
        const p = Math.min((n - s) / 600, 1);
        const e = 1 - Math.pow(1 - p, 3);
        dot.style.transform = `translate(${tx*e}px,${ty*e}px)`;
        dot.style.opacity   = `${1 - p}`;
        p < 1 ? requestAnimationFrame(step) : dot.remove();
      })(performance.now());
    }
  }

  function holoPop(el, delay = 0) {
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px) scale(0.85)';
    el.style.transition = 'none';
    setTimeout(() => {
      // Pre-flash in accent color
      el.style.transition = 'opacity 0.1s, transform 0.1s, box-shadow 0.1s, filter 0.1s';
      el.style.opacity    = '0.6';
      el.style.transform  = 'translateY(28px) scale(0.85)';
      el.style.filter     = 'brightness(2) saturate(3)';
      el.style.boxShadow  = '0 0 20px rgba(255,255,0,0.6)';
      setTimeout(() => {
        el.style.transition = `
          opacity 0.5s cubic-bezier(0.34,1.56,0.64,1),
          transform 0.5s cubic-bezier(0.34,1.56,0.64,1),
          box-shadow 0.5s ease,
          filter 0.5s ease
        `;
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0) scale(1)';
        el.style.filter    = 'none';
        el.style.boxShadow = 'none';
        burst(el);
        shine(el, 200, 'rgba(255,255,0,0.4)');
      }, 120);
    }, delay);
  }

  // ═══════════════════════════════════════════════════════
  // 1. NAVBAR
  // ═══════════════════════════════════════════════════════

  const navLine = document.querySelector('.line');
  if (navLine) {
    navLine.style.transform    = 'scaleY(0)';
    navLine.style.transformOrigin = 'top';
    navLine.style.transition   = 'transform 0.9s cubic-bezier(0.22,1,0.36,1)';
    navLine.style.boxShadow    = '0 0 12px rgba(0, 0, 0, 0.15)';
    setTimeout(() => { navLine.style.transform = 'scaleY(1)'; }, 100);
  }

  document.querySelectorAll('.nav-elements a').forEach((icon, i) => {
    icon.style.opacity   = '0';
    icon.style.transform = 'translateY(-24px)';
    icon.style.transition = 'none';
    setTimeout(() => {
      icon.style.transition = `
        opacity 0.4s cubic-bezier(0.22,1,0.36,1),
        transform 0.4s cubic-bezier(0.22,1,0.36,1)
      `;
      icon.style.opacity   = '1';
      icon.style.transform = 'translateY(0)';
      const btn = icon.querySelector('.icon');
      if (btn) { shine(btn, 280); burst(btn, 'rgba(255,255,255,0.5)'); }
    }, 900 + i * 140);
  });

  // ═══════════════════════════════════════════════════════
  // 2. ACTIVE NAV — Scroll + Click
  // ═══════════════════════════════════════════════════════

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar a');

  function setActive(id) {
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active-btn', active);
      const btn = link.querySelector('.icon');
      if (btn) btn.classList.toggle('active-btn', active);
    });
  }

  new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { threshold: 0.5 }).observe !== undefined &&
  (() => {
    const o = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.5 }
    );
    sections.forEach(s => o.observe(s));
  })();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) setActive(href.slice(1));
    });
  });

 // ═══════════════════════════════════════════════════════
  // 3. LANDING PAGE
  // ═══════════════════════════════════════════════════════

  const LANDING_START = 900; // ADJUST: ms to wait before first animation fires

  const landingEls = [
    { sel: '.txt-box1',   delay: 0   },
    { sel: '.txt-box2',   delay: 120 },
    { sel: '.hi',         delay: 280, glitch: true },
    { sel: '.luis',       delay: 400, glitch: true },
    { sel: '.web',        delay: 600, fade: true },
    { sel: '.under-text', delay: 640 },
    { sel: '.text-line',  delay: 760 },
    { sel: '.ld-btn',     delay: 880 },
  ];

  landingEls.forEach(({ sel, delay, glitch }) => {
    const el = document.querySelector(sel);
    if (!el) return;

    if (glitch) {
      setTimeout(() => {
        let count = 0;
        const colors = ['#ff0','#ff0','#ff0','#fff'];
        const t = setInterval(() => {
          if (count % 2 === 0) {
            const tx = (Math.random() - 0.5) * 8;
            const c  = colors[Math.floor(Math.random() * colors.length)];
            el.style.opacity   = '0.7';
            el.style.transform = `translateX(${tx}px) skewX(${tx}deg)`;
            el.style.filter    = `drop-shadow(0 0 6px ${c})`;
            el.style.color     = c;
          } else {
            el.style.opacity   = '0.4';
            el.style.transform = 'translateX(0)';
            el.style.filter    = 'none';
            el.style.color     = '';
          }
          count++;
          if (count >= 10) {
            clearInterval(t);
            el.style.opacity   = '1';
            el.style.transform = 'translateX(0)';
            el.style.filter    = 'none';
            el.style.color     = '';
          }
        }, 55);
      }, LANDING_START + 300); // ADJUST: offset by LANDING_START

    } else {
      setTimeout(() => {
        el.style.transition = `opacity 0.1s ease, clip-path 0.9s cubic-bezier(0.22,1,0.36,1)`;
        el.style.opacity    = '1';
        el.style.clipPath   = 'inset(0 0% 0 0)';
        shine(el, 400);
      }, LANDING_START + delay); // ADJUST: offset by LANDING_START
    }

    if (el.classList.contains('ld-btn')) {
      setTimeout(() => {
        el.style.transition = `
          background-color 0.2s ease-in-out,
          color 0.2s ease-in-out,
          border-color 0.2s ease-in-out,
          transform 0.2s ease-in-out
        `;
      }, LANDING_START + delay + 900);
    }
  });
  // ═══════════════════════════════════════════════════════
  // 4. SKILLS SECTION
  // ═══════════════════════════════════════════════════════

  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  // Initial hide
  ['.top-label','.txt-left','.txt-right','.ring1','.ring2',
   '.gwapo','.tools','.skills','.explore-btn','.arw'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) { el.style.opacity = '0'; el.style.transition = 'none'; }
  });
  document.querySelectorAll(
    '.tech > div, .skls > div, .top-label div, .txt-left div, .txt-right div'
  ).forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px) scale(0.88)';
    el.style.transition = 'none';
    el.style.width      = el.tagName === 'DIV' && el.parentElement.classList.contains('top-label') ||
                          el.parentElement.classList.contains('txt-left') ||
                          el.parentElement.classList.contains('txt-right')
                          ? '0' : el.style.width;
  });
  // Cleanly hide yellow lines
  document.querySelectorAll('.top-label div, .txt-left div, .txt-right div').forEach(el => {
    el.style.width   = '0';
    el.style.opacity = '0';
    el.style.transition = 'none';
  });

  let skillsAnimated = false;
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || skillsAnimated) return;
      skillsAnimated = true;

      // Labels — scramble typewriter
      const topLabel = document.querySelector('.top-label');
      if (topLabel) { topLabel.style.opacity = '1'; typewrite(topLabel, 100); }
      const txtLeft  = document.querySelector('.txt-left');
      const txtRight = document.querySelector('.txt-right');
      if (txtLeft)  { txtLeft.style.opacity  = '1'; typewrite(txtLeft,  350); }
      if (txtRight) { txtRight.style.opacity = '1'; typewrite(txtRight, 600); }

      // Yellow lines — draw in with glow
      document.querySelectorAll('.top-label div').forEach((l, i) => drawLine(l, 500 + i*150, '10vh'));
      document.querySelectorAll('.txt-left div').forEach((l, i)  => drawLine(l, 700 + i*150, '10vh'));
      document.querySelectorAll('.txt-right div').forEach((l, i) => drawLine(l, 900 + i*150, '10vh'));

      // Big text — glitch reveal
      glitchReveal(document.querySelector('.tools'),  500);
      glitchReveal(document.querySelector('.skills'), 700);

      // Rings
      const ring2 = document.querySelector('.ring2');
      const ring1 = document.querySelector('.ring1');
      if (ring2) {
        ring2.style.transform = 'scale(0.4)';
        ring2.style.filter    = 'brightness(3)';
        setTimeout(() => {
          ring2.style.transition = `
            opacity 1.1s cubic-bezier(0.22,1,0.36,1),
            transform 1.1s cubic-bezier(0.22,1,0.36,1),
            filter 1.1s ease
          `;
          ring2.style.opacity   = '1';
          ring2.style.transform = 'scale(1)';
          ring2.style.filter    = 'none';
        }, 200);
        // Ambient pulse
        setTimeout(() => {
          let grow = true;
          setInterval(() => {
            ring2.style.transition = 'box-shadow 2s ease-in-out';
            ring2.style.boxShadow  = grow
              ? '0 0 60px rgba(255,255,255,0.15), 0 0 120px rgba(255,255,0,0.05)'
              : '0 0 10px rgba(255,255,255,0.04)';
            grow = !grow;
          }, 2200);
        }, 1800);
      }
      if (ring1) {
        ring1.style.transform = 'scale(0.4) rotate(-45deg)';
        setTimeout(() => {
          ring1.style.transition = `
            opacity 1.1s cubic-bezier(0.22,1,0.36,1),
            transform 1.1s cubic-bezier(0.22,1,0.36,1)
          `;
          ring1.style.opacity   = '1';
          ring1.style.transform = 'scale(1) rotate(0deg)';
        }, 420);
        setTimeout(() => {
          let deg = 0;
          setInterval(() => {
            deg += 0.22;
            ring1.style.transition = 'none';
            ring1.style.transform  = `rotate(${deg}deg)`;
          }, 16);
        }, 1600);
      }

      // Photo — spring + scan line effect
      const gwapo = document.querySelector('.gwapo');
      if (gwapo) {
        gwapo.style.transform = 'translateY(70px)';
        gwapo.style.filter    = 'brightness(0) saturate(0)';
        setTimeout(() => {
          gwapo.style.transition = `
            opacity 1s cubic-bezier(0.34,1.56,0.64,1),
            transform 1s cubic-bezier(0.34,1.56,0.64,1),
            filter 1.2s ease
          `;
          gwapo.style.opacity   = '1';
          gwapo.style.transform = 'translateY(0)';
          gwapo.style.filter    = 'none';
        }, 550);
      }

      // Buttons
      fadeUp(document.querySelector('.explore-btn'), 750);
      fadeUp(document.querySelector('.arw'),         900);

      // Icon cards — holo pop
      document.querySelectorAll('.tech > div, .skls > div').forEach((el, i) => {
        const isTech = !!el.closest('.tech');
        holoPop(el, 500 + i * 100);
        el.addEventListener('mouseenter', () => {
          el.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, filter 0.3s ease';
          el.style.transform  = 'translateY(-8px) scale(1.1)';
          el.style.boxShadow  = `0 12px 32px rgba(255,255,${isTech ? '0' : '1'},0.25)`;
          el.style.filter     = 'brightness(1.2)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, filter 0.4s ease';
          el.style.transform  = 'translateY(0) scale(1)';
          el.style.boxShadow  = 'none';
          el.style.filter     = 'none';
        });
      });

    });
  }, { threshold: 0.2 }).observe(skillsSection);

})();

(function () {

  // ═══════════════════════════════════════════════════════
  // SCOPED HELPERS — pj prefix, no conflict with existing
  // ═══════════════════════════════════════════════════════

  // White shine — use only on bordered elements and buttons
  // ADJUST: color, sweep speed (dur)
  function pjShine(el, delay = 0, color = 'rgba(255,255,255,0.55)') {
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const w = document.createElement('div');
      w.style.cssText = `
        position:fixed; top:${r.top}px; left:${r.left}px;
        width:${r.width}px; height:${r.height}px;
        overflow:hidden; pointer-events:none; z-index:9999;
        border-radius:${getComputedStyle(el).borderRadius || '0px'};
      `;
      const beam = document.createElement('div');
      beam.style.cssText = `
        position:absolute; top:0; left:-100%; width:60%; height:100%;
        pointer-events:none;
        background:linear-gradient(105deg,transparent 20%,${color} 50%,transparent 80%);
      `;
      w.appendChild(beam);
      document.body.appendChild(w);
      const s = performance.now();
      const dur = 520; // ADJUST: sweep speed (ms)
      (function step(n) {
        const p = Math.min((n - s) / dur, 1);
        const e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
        beam.style.left = `${-100 + e*200}%`;
        p < 1 ? requestAnimationFrame(step) : w.remove();
      })(performance.now());
    }, delay);
  }

  // Scan wipe left to right
  // ADJUST: clip-path duration '0.7s'
  function pjScan(el, delay = 0) {
    if (!el) return;
    el.style.opacity    = '0';
    el.style.clipPath   = 'inset(0 100% 0 0)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `opacity 0.1s ease, clip-path 0.7s cubic-bezier(0.22,1,0.36,1)`;
      el.style.opacity  = '1';
      el.style.clipPath = 'inset(0 0% 0 0)';
    }, delay);
  }

  // Scan wipe + white shine — only for bordered/button elements
  // ADJUST: shine delay after wipe (ms)
  function pjScanShine(el, delay = 0) {
    if (!el) return;
    pjScan(el, delay);
    pjShine(el, delay + 420, 'rgba(255,255,255,0.55)'); // ADJUST: shine color stays white
  }

  // Fade up from below
  // ADJUST: duration (ms), translateY offset
  function pjFadeUp(el, delay = 0, duration = 700) {
    if (!el) return;
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(36px)'; // ADJUST: starting offset
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `
        opacity ${duration}ms cubic-bezier(0.22,1,0.36,1),
        transform ${duration}ms cubic-bezier(0.22,1,0.36,1)
      `;
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }

  // Fade in individual inline element (span/p) — no transform
  // Used for text items inside a block so only the text moves, not the container
  function pjFadeIn(el, delay = 0, duration = 600) {
    if (!el) return;
    el.style.opacity    = '0';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1)`;
      el.style.opacity    = '1';
    }, delay);
  }

  // Yellow/gold line draws in from left with glow
  // ADJUST: finalWidth, glow colors
  function pjLine(el, delay = 0, finalWidth = '5vh') {
    if (!el) return;
    el.style.width      = '0';
    el.style.opacity    = '0';
    el.style.boxShadow  = '0 0 8px rgba(255,215,0,0.9)'; // ADJUST: initial glow
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `
        width 0.7s cubic-bezier(0.22,1,0.36,1),
        opacity 0.3s ease, box-shadow 1s ease
      `;
      el.style.opacity = '1';
      el.style.width   = finalWidth;
      setTimeout(() => {
        el.style.boxShadow = '0 0 3px rgba(255,215,0,0.25)'; // ADJUST: ambient glow after draw
      }, 800);
    }, delay);
  }

  // Image powers on from black
  // ADJUST: spring easing, filter duration
  function pjImageReveal(el, delay = 0) {
    if (!el) return;
    el.style.opacity    = '0';
    el.style.transform  = 'scale(0.97) translateY(16px)';
    el.style.filter     = 'brightness(0)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = `
        opacity 0.9s cubic-bezier(0.22,1,0.36,1),
        transform 0.9s cubic-bezier(0.34,1.56,0.64,1),
        filter 1.1s ease
      `;
      el.style.opacity   = '1';
      el.style.transform = 'scale(1) translateY(0)';
      el.style.filter    = 'none';
    }, delay);
  }

  // Particle burst
  // ADJUST: count, dist, duration, color
  function pjBurst(el, color = 'rgba(255,215,0,0.85)') {
    const r  = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    for (let i = 0; i < 8; i++) { // ADJUST: particle count
      const dot   = document.createElement('div');
      const angle = (i / 8) * Math.PI * 2;
      const dist  = 20 + Math.random() * 18; // ADJUST: explosion radius
      const size  = 2 + Math.random() * 2.5;
      dot.style.cssText = `
        position:fixed; width:${size}px; height:${size}px;
        border-radius:50%; background:${color};
        left:${cx}px; top:${cy}px;
        pointer-events:none; z-index:9999;
      `;
      document.body.appendChild(dot);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const s  = performance.now();
      (function step(n) {
        const p = Math.min((n - s) / 580, 1); // ADJUST: burst duration (ms)
        const e = 1 - Math.pow(1 - p, 3);
        dot.style.transform = `translate(${tx*e}px,${ty*e}px)`;
        dot.style.opacity   = `${1 - p}`;
        p < 1 ? requestAnimationFrame(step) : dot.remove();
      })(performance.now());
    }
  }

  // Glitch reveal — same as existing glitchReveal, scoped to pj
  // Used on big label texts (.Project badge, .pj-title spans)
  // ADJUST: glitchColors array, interval speed (55ms), count (10)
  function pjGlitch(el, delay = 0) {
    if (!el) return;
    el.style.opacity    = '0';
    el.style.transition = 'none';
    setTimeout(() => {
      let count = 0;
      const glitchColors = ['#ff0','#ff0','#ff0','#fff']; // ADJUST: flicker colors
      const t = setInterval(() => {
        if (count % 2 === 0) {
          const tx = (Math.random() - 0.5) * 8;
          const c  = glitchColors[Math.floor(Math.random() * glitchColors.length)];
          el.style.opacity   = '0.7';
          el.style.transform = `translateX(${tx}px) skewX(${tx}deg)`;
          el.style.filter    = `drop-shadow(0 0 6px ${c})`;
          el.style.color     = c;
        } else {
          el.style.opacity   = '0.4';
          el.style.transform = 'translateX(0)';
          el.style.filter    = 'none';
          el.style.color     = '';
        }
        count++;
        if (count >= 10) { // ADJUST: how many flicker frames
          clearInterval(t);
          el.style.opacity   = '1';
          el.style.transform = 'translateX(0)';
          el.style.filter    = 'none';
          el.style.color     = '';
        }
      }, 55); // ADJUST: flicker speed (ms)
    }, delay);
  }

  // ═══════════════════════════════════════════════════════
  // PROJECT SECTIONS — reusable for both
  // ═══════════════════════════════════════════════════════

  function animateProject(sectionId) {
    const section = document.querySelector(`#${sectionId}`);
    if (!section) return;

    // Scoped selectors — no bleed between sections
    const badge      = section.querySelector('.Project');       // yellow badge
    const featured   = section.querySelector('.Featured');      // "FEATURED PROJECT" label
    const pjTitle    = section.querySelector('.pj-title');      // big title block
    const secTxt     = section.querySelector('.sec-txt');       // category label
    const secLine    = section.querySelector('.sec-txt div');   // yellow line under category
    const mainTxt    = section.querySelector('.main-txt');      // description paragraph
    const separator  = section.querySelector('.separator');     // horizontal rule
    const thirdTxt   = section.querySelector('.third-txt');     // OVERVIEW / SCREENSHOTS labels
    const thirdLines = section.querySelectorAll('.third-lines div'); // yellow lines under them
    const fourthTxt  = section.querySelector('.fourth-txt');    // overview paragraph
    // Target individual spans inside fifth-txt and fifth-txt2, not the blocks
    const roleLabel      = section.querySelector('.fifth-txt span:nth-child(1)');
    const durationLabel  = section.querySelector('.fifth-txt span:nth-child(2)');
    const roleVal        = section.querySelector('.fifth-txt2 span:nth-child(1)');
    const durationVal    = section.querySelector('.fifth-txt2 span:nth-child(2)');
    const largeImg   = section.querySelector('.large');
    const boxImgs    = section.querySelectorAll('.box div');
    const viewBtn    = section.querySelector('.view-btn, .view-btn2');

    // ── INITIAL HIDE ──────────────────────────────────
    [badge, featured, pjTitle, secTxt, mainTxt, separator,
     thirdTxt, fourthTxt, largeImg, viewBtn
    ].forEach(el => {
      if (!el) return;
      el.style.opacity    = '0';
      el.style.transition = 'none';
    });

    // Hide individual label spans
    [roleLabel, durationLabel, roleVal, durationVal].forEach(el => {
      if (!el) return;
      el.style.opacity    = '0';
      el.style.transition = 'none';
    });

    if (secLine) {
      secLine.style.width = '0'; secLine.style.opacity = '0'; secLine.style.transition = 'none';
    }
    thirdLines.forEach(l => {
      l.style.width = '0'; l.style.opacity = '0'; l.style.transition = 'none';
    });
    boxImgs.forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(22px) scale(0.94)';
      el.style.filter     = 'brightness(0)';
      el.style.transition = 'none';
    });

    let animated = false;
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || animated) return;
        animated = true;

        // Badge — glitch (has background color, counts as styled element)
        pjGlitch(badge, 100); // ADJUST: badge delay (ms)

        // Featured label — plain scan, no shine (plain text, no border)
        pjScan(featured, 260); // ADJUST: featured label delay (ms)

        // Project title — spring bounce
        // Shine only on .secondary span (has yellow background = styled)
        if (pjTitle) {
          pjTitle.style.transform  = 'translateY(50px)';
          pjTitle.style.transition = 'none';
          setTimeout(() => {
            pjTitle.style.transition = `
              opacity 0.8s cubic-bezier(0.34,1.56,0.64,1),
              transform 0.8s cubic-bezier(0.34,1.56,0.64,1)
            `;
            pjTitle.style.opacity   = '1';
            pjTitle.style.transform = 'translateY(0)';
            // Shine only on .secondary — it has a yellow background/border
            // ADJUST: shine delay and color
            const secondary = pjTitle.querySelector('.secondary');
            if (secondary) pjShine(secondary, 500, 'rgba(255,255,255,0.55)');
          }, 300); // ADJUST: title delay (ms)
        }

        // Category label — plain scan (plain text)
        pjScan(secTxt, 440);
        // Category yellow line — draw in (styled element, gets line glow)
        if (secLine) pjLine(secLine, 620, '3vw'); // ADJUST: line final width

        // Description — plain fade up (plain text, no shine)
        pjFadeUp(mainTxt, 560);

        // Separator — scales from center
        if (separator) {
          separator.style.transform       = 'scaleX(0)';
          separator.style.transformOrigin = 'center';
          separator.style.transition      = 'none';
          setTimeout(() => {
            separator.style.transition = `opacity 0.3s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)`;
            separator.style.opacity   = '1';
            separator.style.transform = 'scaleX(1)';
          }, 660); // ADJUST: separator delay (ms)
        }

        // Overview/screenshots labels — plain scan
        pjScan(thirdTxt, 720);
        // Their yellow lines — draw in with glow
        thirdLines.forEach((l, i) => pjLine(l, 900 + i * 130, '5vh')); // ADJUST: stagger

        // Overview paragraph — plain fade up
        pjFadeUp(fourthTxt, 840);

        // Role / Duration — target individual spans, staggered fade in
        // Plain text — no shine
        // ADJUST: delays (ms) per span
        pjFadeIn(roleLabel,     920);
        pjFadeIn(durationLabel, 980);
        pjFadeIn(roleVal,      1040);
        pjFadeIn(durationVal,  1100);

        // Large image — cinematic power on
        pjImageReveal(largeImg, 380); // ADJUST: image delay

        // Box images — staggered power on
        boxImgs.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = `
              opacity 0.65s cubic-bezier(0.34,1.56,0.64,1),
              transform 0.65s cubic-bezier(0.34,1.56,0.64,1),
              filter 0.8s ease
            `;
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0) scale(1)';
            el.style.filter    = 'none';
          }, 620 + i * 130); // ADJUST: base delay + stagger (ms)
        });

        // View button — scan + white shine (has border) + burst on arrival
        if (viewBtn) {
          setTimeout(() => {
            pjScanShine(viewBtn, 0); // has yellow border — gets shine
            pjBurst(viewBtn);
            // Restore hover transition after animation
            // ADJUST: hover speeds
            setTimeout(() => {
              viewBtn.style.transition = `
                background-color 0.2s ease-in-out,
                color 0.2s ease-in-out,
                transform 0.2s ease-in-out,
                border-color 0.2s ease-in-out
              `;
            }, 800);
          }, 920); // ADJUST: view button delay (ms)

          // White shine on hover — has border so qualifies
          viewBtn.addEventListener('mouseenter', () => {
            pjShine(viewBtn, 0, 'rgba(255,255,255,0.55)'); // ADJUST: hover shine
          });
        }

      });
    }, { threshold: 0.15 }).observe(section); // ADJUST: scroll trigger (0–1)
  }

  animateProject('first-project');
  animateProject('second-project');

  // ═══════════════════════════════════════════════════════
  // CONTACT SECTION
  // ═══════════════════════════════════════════════════════

  const contactSection = document.querySelector('#contact');
  if (!contactSection) return;

  const contactTitle = contactSection.querySelector('.contacts span');
  const contactBtn   = contactSection.querySelector('.contacts button');
  const footerIcons  = contactSection.querySelectorAll('.footer-icons div');
  const footerCopy   = contactSection.querySelector('footer p');

  // ── INITIAL HIDE ──────────────────────────────────────
  [contactTitle, contactBtn, footerCopy].forEach(el => {
    if (!el) return;
    el.style.opacity = '0'; el.style.transition = 'none';
  });
  footerIcons.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(18px) scale(0.9)';
    el.style.transition = 'none';
  });

  let contactAnimated = false;
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || contactAnimated) return;
      contactAnimated = true;

      // "Let's Work Together" — big text gets glitch reveal
      pjGlitch(contactTitle, 100); // ADJUST: title delay (ms)

      // SAY HELLO button — has border so gets scan + white shine + burst
      setTimeout(() => {
        pjScanShine(contactBtn, 0);
        pjBurst(contactBtn, 'rgba(255,215,0,0.7)');
        // Restore hover transition
        // ADJUST: hover speeds
        setTimeout(() => {
          contactBtn.style.transition = `
            background-color 0.2s ease-in-out,
            color 0.2s ease-in-out,
            transform 0.2s ease-in-out
          `;
        }, 800);
      }, 520); // ADJUST: button delay (ms)

      // White shine on hover — has border so qualifies
      if (contactBtn) {
        contactBtn.addEventListener('mouseenter', () => {
          pjShine(contactBtn, 0, 'rgba(255,255,255,0.55)'); // ADJUST: hover shine
        });
      }

      // Footer icons — spring pop staggered + burst
      // No shine on hover — plain SVG icons, no border
      footerIcons.forEach((el, i) => {
        setTimeout(() => {
          el.style.transition = `
            opacity 0.5s cubic-bezier(0.34,1.56,0.64,1),
            transform 0.5s cubic-bezier(0.34,1.56,0.64,1)
          `;
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0) scale(1)';
          pjBurst(el, 'rgba(255,215,0,0.55)');
        }, 780 + i * 100); // ADJUST: base delay + stagger (ms)
      });

      // Copyright — plain text, fade up only
      pjFadeUp(footerCopy, 1150); // ADJUST: copyright delay (ms)

    });
  }, { threshold: 0.3 }).observe(contactSection); // ADJUST: scroll trigger (0–1)

})();