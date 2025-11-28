document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById('nav-icon');
  const menu = document.getElementById('slide-menu');
  const header = document.querySelector('header');

  // --- ton toggle existant ---
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.querySelectorAll('#slide-menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });

  // --- IntersectionObserver existant pour positionner le menu sous le header ---
  const ioHeader = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // header visible -> menu doit rester under the header border
        menu.style.top = "10vh";
      } else {
        // header non visible -> menu peut monter above all content
        menu.style.top = "0";
      }
    });
  }, { root: null, threshold: 0.01 });

  ioHeader.observe(header);

  // --- Nouveau : detection fiable de la section *sous* le header ---
  const headerHeight = () => header.offsetHeight || (window.innerHeight * 0.1); // fallback

  let ticking = false;
  function checkSectionBelowHeader() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const x = window.innerWidth / 2;
      const y = headerHeight() + 1; // point juste sous le header

      // document.elementsFromPoint renvoie la pile d'éléments du plus haut au plus bas
      const elems = document.elementsFromPoint(x, y) || [];

      // Trouve le premier élément qui n'est pas dans le menu ni dans le header
      let underlying = null;
      for (let el of elems) {
        if (!el) continue;
        if (el.closest && (el.closest('#slide-menu') || el.closest('header'))) {
          // ignore les éléments qui font partie du slider ou du header
          continue;
        }
        underlying = el;
        break;
      }

      // Si on n'a rien trouvé, on peut fallback à la première élément qui est une section dans la pile
      if (!underlying) {
        for (let el of elems) {
          if (!el) continue;
          const sect = el.closest && el.closest('section');
          if (sect) { underlying = el; break; }
        }
      }

      // Trouve la section parente (si possible)
      const section = underlying ? underlying.closest && underlying.closest('section') : null;

      // Appliquer les classes : ici on veut que le SLIDE change quand la section sous le header est blanche
      const isWhite = section && section.classList.contains('white-section');

      // Si tu veux que le header suive aussi, active la ligne header.classList...
      if (isWhite) {
        menu.classList.add('dark-mode');   // le slider passe en noir (texte noir)
        header.classList.add('dark-mode'); // optionnel : décommenter si header doit suivre
      } else {
        menu.classList.remove('dark-mode');
        header.classList.remove('dark-mode'); // optionnel
      }

      ticking = false;
    });
  }

  // Écouteurs performants
  window.addEventListener('scroll', checkSectionBelowHeader, { passive: true });
  window.addEventListener('resize', checkSectionBelowHeader);
  // observe ouverture/fermeture du menu (si la classe open change, on recalcule)
  const mo = new MutationObserver(checkSectionBelowHeader);
  mo.observe(menu, { attributes: true, attributeFilter: ['class', 'style'] });

  // Face à certains changements du DOM (sliders dynamiques), observe le body (facultatif)
  const moDom = new MutationObserver(checkSectionBelowHeader);
  moDom.observe(document.body, { childList: true, subtree: true });

  // run initial check après rendu
  setTimeout(checkSectionBelowHeader, 50);
});