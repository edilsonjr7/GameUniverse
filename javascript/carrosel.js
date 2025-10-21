// carrosel.js (rolagem por scroll — ideal para múltiplos itens visíveis)
document.addEventListener('DOMContentLoaded', () => {
  // tenta encontrar o container (compatível com várias estruturas)
  const slidesContainer = document.getElementById('carrossel-slides') || document.querySelector('.slides');
  if (!slidesContainer) return;

  // botões (várias formas de referência)
  const prevBtn = document.getElementById('carrossel-prev') || document.querySelector('.prev') || document.querySelector('.prev-slide');
  const nextBtn = document.getElementById('carrossel-next') || document.querySelector('.next') || document.querySelector('.next-slide');
  const cartBtn = document.querySelector('.shopping-cart');

  // segurança: garantir overflow-x auto e comportamento smooth
  slidesContainer.style.overflowX = 'auto';
  slidesContainer.style.scrollBehavior = 'smooth';
  slidesContainer.style.webkitOverflowScrolling = 'touch'; // iOS

  // garante que cada slide não quebre e fique lado a lado
  const slides = Array.from(slidesContainer.children).filter(c => c.classList.contains('slide') || c.tagName.toLowerCase() === 'article' || true);
  slides.forEach(s => {
    s.style.flex = s.style.flex || '0 0 auto';
    s.style.display = s.style.display || 'block';
    // imagens dentro do slide
    const img = s.querySelector ? s.querySelector('img') : null;
    if (img) {
      img.style.width = img.style.width || '100%';
      img.style.height = img.style.height || '100%';
      img.style.objectFit = img.style.objectFit || 'cover';
      img.style.display = 'block';
    }
  });

  // calcula distância de scroll por clique: tenta usar largura de 1 item visível
  function getScrollAmount() {
    // preferência: largura do primeiro slide + gap, senão usa 75% da viewport do carrossel
    const first = slides[0];
    if (first) {
      const style = getComputedStyle(first);
      const marginLeft = parseFloat(style.marginLeft || 0);
      const marginRight = parseFloat(style.marginRight || 0);
      return Math.round(first.getBoundingClientRect().width + marginLeft + marginRight);
    }
    return Math.round(slidesContainer.clientWidth * 0.75);
  }

  // ações de scroll
  function scrollNext() {
    const amt = getScrollAmount();
    slidesContainer.scrollBy({ left: amt, behavior: 'smooth' });
  }
  function scrollPrev() {
    const amt = getScrollAmount();
    slidesContainer.scrollBy({ left: -amt, behavior: 'smooth' });
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); scrollNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); scrollPrev(); });

  // teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') scrollNext();
    if (e.key === 'ArrowLeft') scrollPrev();
  });

  // touch swipe (mais direto para containers scrolláveis)
  (function enableSwipe() {
    let startX = 0, startScroll = 0, dragging = false;
    slidesContainer.addEventListener('touchstart', (ev) => {
      if (!ev.touches || ev.touches.length === 0) return;
      dragging = true;
      startX = ev.touches[0].clientX;
      startScroll = slidesContainer.scrollLeft;
    }, {passive: true});
    slidesContainer.addEventListener('touchmove', (ev) => {
      if (!dragging || !ev.touches) return;
      const x = ev.touches[0].clientX;
      const dx = startX - x;
      // arrasta junto com o dedo (sem smooth)
      slidesContainer.scrollLeft = startScroll + dx;
    }, {passive: true});
    slidesContainer.addEventListener('touchend', () => { dragging = false; }, {passive: true});
  })();

  // opcional: autoplay simples que rola devagar, pausa quando hover
  let autoplayId = null;
  const AUTOPLAY_MS = 4500;
  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(() => {
      // se chegou no fim, volta ao começo
      if (slidesContainer.scrollLeft + slidesContainer.clientWidth >= slidesContainer.scrollWidth - 5) {
        slidesContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollNext();
      }
    }, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
  }
  slidesContainer.addEventListener('mouseenter', stopAutoplay);
  slidesContainer.addEventListener('mouseleave', startAutoplay);

  // start autoplay (se quiser desativar, comente a linha abaixo)
  startAutoplay();

  // reposiciona quando redimensiona (p/ recalcular scrollAmount futuro)
  window.addEventListener('resize', () => { /* nada específico, getScrollAmount irá recalcular */ });

  // se quiser abrir carrinho via botão (compatibilidade)
  if (cartBtn) cartBtn.addEventListener('click', (e) => { /* seu código de abrir carrinho já existente */ });

});
