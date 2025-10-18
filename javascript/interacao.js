let slideIndex = 0;

function mostrarSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;

    if (index >= totalSlides) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = totalSlides - 1;
    } else {
        slideIndex = index;
    }

    slides.style.transform = `translateX(${-slideIndex * 100}%)`;
}

function moverSlide(n) {
    mostrarSlide(slideIndex + n);
}

