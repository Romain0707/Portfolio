document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById('nav-icon');
  const menu = document.getElementById('slide-menu');
  const header = document.querySelector('header');
  const logo = document.getElementById('logo');

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.classList.toggle('cross');
  });

  document.querySelectorAll('#slide-menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('cross');
    });
  });
  
  const headerHeight = () => header.offsetHeight || (window.innerHeight * 0.1); 

  let ticking = false;
  function checkSectionBelowHeader() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const x = window.innerWidth / 2;
      const y = headerHeight() + 1; 

      
      const elems = document.elementsFromPoint(x, y) || [];

     
      let underlying = null;
      for (let el of elems) {
        if (!el) continue;
        if (el.closest && (el.closest('#slide-menu') || el.closest('header'))) {
          
          continue;
        }
        underlying = el;
        break;
      }

     
      if (!underlying) {
        for (let el of elems) {
          if (!el) continue;
          const sect = el.closest && el.closest('section');
          if (sect) { underlying = el; break; }
        }
      }

      
      const section = underlying ? underlying.closest && underlying.closest('section') : null;

      
      const isWhite = section && section.classList.contains('white-section');

      
      if (isWhite) {
        menu.classList.add('dark-mode');   
        header.classList.add('dark-mode'); 
        logo.setAttribute('src', 'assets/img/logo-noir.png');
      } else {
        menu.classList.remove('dark-mode');
        header.classList.remove('dark-mode'); 
        logo.setAttribute('src', 'assets/img/logo.png');
      }

      ticking = false;
    });
  }

  
  window.addEventListener('scroll', checkSectionBelowHeader, { passive: true });
  window.addEventListener('resize', checkSectionBelowHeader);
  
  const mo = new MutationObserver(checkSectionBelowHeader);
  mo.observe(menu, { attributes: true, attributeFilter: ['class', 'style'] });

  
  const moDom = new MutationObserver(checkSectionBelowHeader);
  moDom.observe(document.body, { childList: true, subtree: true });

  
  setTimeout(checkSectionBelowHeader, 50);
});


const message = document.getElementById('submit-message');
const thanks = document.getElementById('thanks');
const header = document.querySelector('header');

message.addEventListener('click', function (event) {
  event.preventDefault();
  header.style.position = 'absolute';
  thanks.classList.add('active');
})

thanks.addEventListener('click', function (event) {
  thanks.classList.remove('active');
})
