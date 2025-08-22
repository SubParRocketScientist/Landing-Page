// script.js
// Parallax + subtle pointer parallax. Lightweight and debounced via requestAnimationFrame.
// Customize speed by editing data-speed attributes on .parallax-layer elements.

(() => {
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  const container = document.querySelector('.container');
  let lastScroll = window.scrollY;
  let ticking = false;

  let scrollTransforms = layers.map(() => '');
  let moveTransforms = layers.map(() => '');

  function applyTransforms() {
    layers.forEach((layer, i) => {
      layer.style.transform = `${scrollTransforms[i]} ${moveTransforms[i]}`;
    });
  }

  function updateOnScroll() {
    const sc = window.scrollY || window.pageYOffset;
    layers.forEach((layer, i) => {
      const speed = parseFloat(layer.dataset.speed) || 0.1;
      const y = (sc * speed);
      scrollTransforms[i] = `translate(-50%, calc(-50% + ${y}px)) scale(${1 + speed / 10})`;
    });
    applyTransforms();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, {passive: true});

  // Subtle mousemove parallax for depth on desktop
  let lastMove = {x:0, y:0};
  function onMove(e) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const mx = (e.clientX - cx) / cx;
    const my = (e.clientY - cy) / cy;
    layers.forEach((layer, i) => {
      const factor = (i + 1) * 6;
      const rx = mx * factor;
      const ry = my * factor;
      moveTransforms[i] = `translate3d(${rx}px, ${ry}px, 0)`;
    });
    applyTransforms();
  }

  // Throttle mousemove via rAF
  let moveTick = false;
  window.addEventListener('mousemove', (e) => {
    if (!moveTick) {
      window.requestAnimationFrame(() => { onMove(e); moveTick = false; });
      moveTick = true;
    }
  }, {passive: true});

  // Optional: smooth in-page anchor scrolling (unobtrusive)
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    ev.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: 'smooth', block: 'center'});
  });

  // Initial update to set background positions correctly
  updateOnScroll();
})();

// social-icons macOS-style bounce before opening link
(function(){
  const socialAnchors = document.querySelectorAll('.social a[href]');
  socialAnchors.forEach(a => {
    a.addEventListener('click', function(evt){
      // allow modifier-clicks (ctrl/cmd/shift/middle) to bypass bounce and open normally
      if (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.button === 1) return;
      evt.preventDefault();
      const href = a.href;
      const target = a.getAttribute('target') || '_blank';

      // prevent double clicks while animation runs
      if (a.classList.contains('bounce-running')) return;
      a.classList.add('bounce-running', 'bounce');
      a.setAttribute('aria-disabled', 'true');
      a.style.pointerEvents = 'none';

      const cleanupAndOpen = () => {
        // open link after animation ends
        try { window.open(href, target); } catch (e) { location.href = href; }
        // restore state
        a.classList.remove('bounce');
        a.classList.remove('bounce-running');
        a.removeAttribute('aria-disabled');
        a.style.pointerEvents = '';
      };

      // fallback timeout in case animationend doesn't fire
      const fallback = setTimeout(cleanupAndOpen, 800);

      a.addEventListener('animationend', function once() {
        clearTimeout(fallback);
        cleanupAndOpen();
      }, { once: true, passive: true });
    }, { passive: false });
  });
})();