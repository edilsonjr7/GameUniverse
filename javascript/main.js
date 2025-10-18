document.addEventListener('DOMContentLoaded', () => {
    // Carrossel de jogos (seção já existente)
    let slideIndex = 0;
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;

    window.moverSlide = function(n) {
        slideIndex += n;
        if (slideIndex >= totalSlides) {
            slideIndex = 0;
        }
        if (slideIndex < 0) {
            slideIndex = totalSlides - 1;
        }
        slides.style.transform = `translateX(-${slideIndex * 100}%)`;
    }

    // --- Nova Seção de Categorias ---
    const categorias = [
        { nome: 'Jogos de R.V.', imagem: 'url(https://via.placeholder.com/280x180.png?text=Jogos+de+RV)' },
        { nome: 'Simulador', imagem: 'url(https://via.placeholder.com/280x180.png?text=Simulador)' },
        { nome: 'Romance Visual', imagem: 'url(https://via.placeholder.com/280x180.png?text=Romance+Visual)' },
        { nome: 'Ficção Científica e Cyberpunk', imagem: 'url(https://via.placeholder.com/280x180.png?text=Ficcao+Cientifica)' },
        { nome: 'Ação', imagem: 'url(https://via.placeholder.com/280x180.png?text=Acao)' },
        { nome: 'RPG', imagem: 'url(https://via.placeholder.com/280x180.png?text=RPG)' },
        { nome: 'Estratégia', imagem: 'url(https://via.placeholder.com/280x180.png?text=Estrategia)' },
    ];

    const listaCategorias = document.querySelector('.lista-categorias');

    // Função para renderizar os cards de categoria
    function renderizarCategorias() {
        listaCategorias.innerHTML = ''; // Limpa a lista antes de renderizar
        categorias.forEach(categoria => {
            const card = document.createElement('div');
            card.classList.add('categoria-card');
            card.style.backgroundImage = categoria.imagem;
            card.innerHTML = `<span>${categoria.nome}</span>`;
            listaCategorias.appendChild(card);
        });
    }

    // Renderiza as categorias ao carregar a página
    renderizarCategorias();

    // Lógica para navegação do carrossel de categorias
    const prevBtn = document.querySelector('.prev-cat');
    const nextBtn = document.querySelector('.next-cat');

    prevBtn.addEventListener('click', () => {
        listaCategorias.scrollBy({
            left: -300, // Ajuste este valor conforme o tamanho do card + gap
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        listaCategorias.scrollBy({
            left: 300, // Ajuste este valor conforme o tamanho do card + gap
            behavior: 'smooth'
        });
    });
});