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

  const landingParent = document.querySelector('.landing-page');
  if (landingParent) {
    landingParent.style.cssText += 'opacity:0;transform:translateX(-80px);transition:none;';
    setTimeout(() => {
      landingParent.style.transition = 'none';
      landingParent.style.opacity    = '1';
      landingParent.style.transform  = 'translateX(0)';
    }, 10);
  }

  [
    { sel: '.txt-box1',   delay: 0,   fn: 'scan'  },
    { sel: '.txt-box2',   delay: 120, fn: 'scan'  },
    { sel: '.hi',         delay: 280, fn: 'glitch' },
    { sel: '.luis',       delay: 400, fn: 'glitch' },
    { sel: '.web',        delay: 520, fn: 'glitch' },
    { sel: '.under-text', delay: 640, fn: 'scan'  },
    { sel: '.text-line',  delay: 760, fn: 'scan'  },
    { sel: '.ld-btn',     delay: 880, fn: 'scan'  },
  ].forEach(({ sel, delay, fn }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (fn === 'glitch') {
      el.style.opacity = '0';
      glitchReveal(el, delay + 60);
    } else {
      scanReveal(el, delay + 60);
    }
    // Restore button hover transition after animation
    if (el.classList.contains('ld-btn')) {
      setTimeout(() => {
      // ADJUST: add/remove properties and durations as needed
      el.style.transition = `
      background-color 0.5s ease-in-out,
      color 0.5s ease-in-out,
      border-color 0.5s ease-in-out,
      transform 0.5s ease-in-out
    `;
  }, delay + 60 + 900);
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