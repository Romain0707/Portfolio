new Swiper('.card-wrapper', {

  loop: true,
  spaceBetween: 30,

  // Pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    0: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 2
    },
    1024: {
        slidesPerView: 3
    },
  }
});



const burger = document.getElementById('nav-icon');
const menu = document.getElementById('slide-menu');
const header = document.querySelector('header');

burger.addEventListener('click', () => {
  menu.classList.toggle('open');
});

// Utilise IntersectionObserver pour savoir si le header est visible dans le viewport
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // header visible -> menu doit rester UNDER the header border
      menu.style.top = "10vh"
    } else {
      // header non visible -> menu peut monter above all content
      menu.style.top = "0"
    }
  });
}, { root: null, threshold: 0.01 });

io.observe(header);

document.querySelectorAll('#slide-menu a').forEach(a => {
  a.addEventListener('click', () => {
    menu.classList.remove('open');
  });
});

