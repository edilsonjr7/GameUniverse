// Usa o id do usuário para associar o carrinho à sessão
// OBS: Esta variável só é inicializada na primeira vez que o JS roda.
// Se o usuário logar/deslogar, a página deve ser recarregada.
const userData = JSON.parse(localStorage.getItem('userData'));
const userId = userData ? userData.id : 'guest';
// Define uma chave de armazenamento única para cada usuário
const CART_STORAGE_KEY = `carrinho_${userId}`; 
const userToken = localStorage.getItem('userToken'); // CRÍTICO: Pega o token aqui

// --- Funções de Gerenciamento do Carrinho (Frontend) ---

function loadCartItems() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
}

function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartDisplay();
}

/**
 * Adiciona um jogo ao carrinho.
 * @param {Object} game - Objeto com {id, title, price} do jogo.
 */
export async function addItemToCart(game) {
    if (!userData || !userToken) {
        alert("Por favor, faça login para adicionar jogos ao carrinho.");
        // Redireciona para a página de escolha (que levará ao login)
        window.location.href = 'EscolherPerfil.html'; 
        return;
    }

    const items = loadCartItems();
    const existingItem = items.find(item => item.id === game.id);

    if (existingItem) {
        alert(`${game.title} já está no seu carrinho!`);
        return;
    }

    // 1. CHAMA O BACKEND (ROTA PROTEGIDA)
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Envia o token para o middleware 'verifyToken' no server.js
                'Authorization': `Bearer ${userToken}` 
            },
            body: JSON.stringify({ 
                gameId: game.id // Envia o ID do jogo para o servidor
            })
        });

        const resultado = await response.json();

        if (response.ok) {
            // 2. SE O BACKEND ACEITOU, SALVA LOCALMENTE
            items.push({ 
                id: game.id, 
                title: game.title, 
                price: game.price 
            });

            saveCartItems(items);
            alert(`"${game.title}" adicionado ao carrinho. ${resultado.message}`);
        } else {
            // Se o servidor retornou 401/403 (Token inválido/expirado)
            alert(resultado.message || 'Falha ao adicionar ao carrinho. Tente logar novamente.');
            console.error("Erro do Servidor:", resultado.message);
            // Opcional: Redirecionar para login se o token falhou
            if (response.status === 401 || response.status === 403) {
                 window.handleLogout(); // Função global definida em index.html
            }
        }

    } catch (error) {
        console.error("Erro de rede/servidor:", error);
        alert('Erro de conexão com o servidor. Verifique o console.');
    }
}

/**
 * Remove um jogo do carrinho.
 * @param {number} gameId 
 */
export function removeItemFromCart(gameId) {
    const items = loadCartItems();
    const updatedItems = items.filter(item => item.id !== gameId);

    saveCartItems(updatedItems);
    alert("Jogo removido do carrinho.");
}

// --- NOVO: FUNÇÃO DE CHECKOUT ---
async function handleCheckout() {
    const items = loadCartItems();
    if (items.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Pega o total para exibir no confirm
    const total = items.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    if (!confirm(`Confirma a compra de ${items.length} itens no valor total de R$ ${total}?`)) {
        return;
    }

    const modal = document.getElementById('cart-modal');
    const currentToken = localStorage.getItem('userToken'); // Usa o token mais atualizado

    try {
        const response = await fetch('/api/compra/finalizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Envia o token para a rota protegida
                'Authorization': `Bearer ${currentToken}`
            }
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.message);
            // 1. Limpa o carrinho localmente e no display
            saveCartItems([]); 
            // 2. Fecha o modal
            modal.style.display = 'none';
        } else {
            // Captura o erro do servidor (ex: Jogo já comprado - status 409)
            alert(`Falha na compra: ${resultado.message}`);
        }

    } catch (error) {
        console.error("Erro de rede/servidor durante o checkout:", error);
        alert('Erro de conexão com o servidor. Verifique o console.');
    }
}

// --- Funções de Interface ---

function updateCartDisplay() {
    const items = loadCartItems();
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = items.length;
        // Mostra o contador se houver itens, caso contrário esconde
        cartCountElement.style.display = items.length > 0 ? 'flex' : 'none'; 
    }
    renderCartModal();
}

/**
 * Renderiza o conteúdo do carrinho em um modal.
 */
function renderCartModal() {
    const items = loadCartItems();
    // O id no index.html deve ser 'cart-modal-content', não 'cart-items'
    const modalContent = document.getElementById('cart-modal-content'); 
    const totalElement = document.getElementById('cart-total');
    let total = 0;

    if (!modalContent) return; 

    if (items.length === 0) {
        modalContent.innerHTML = '<p>Seu carrinho está vazio.</p>';
        totalElement.textContent = 'R$ 0.00';
        return;
    }

    const listHtml = items.map(item => {
        // Garante que o preço seja um número antes de somar
        const price = parseFloat(item.price);
        total += price;
        return `
            <li>
                <span>${item.title}</span>
                <span>R$ ${price.toFixed(2)}</span>
                <button onclick="window.removeItemFromCart(${item.id})">Remover</button>
            </li>
        `;
    }).join('');

    modalContent.innerHTML = `<ul>${listHtml}</ul>`;
    totalElement.textContent = `R$ ${total.toFixed(2)}`;
}

// --- Inicialização e Eventos ---

// Ação de abrir e fechar o modal
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.shopping-cart');
    const modal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    // NOVO: Adiciona o listener para o botão de Finalizar Compra no modal
    const checkoutButton = document.querySelector('#cart-modal .checkout-btn');

    if (cartIcon && modal && closeButton) {
        cartIcon.addEventListener('click', () => {
            modal.style.display = 'block';
            renderCartModal();
        });
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Atribui o evento de checkout ao botão, se ele existir
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }


    updateCartDisplay();
});

// Expõe as funções globalmente para que os botões 'onclick' no HTML funcionem
window.addItemToCart = addItemToCart;
window.removeItemFromCart = removeItemFromCart;
window.loadCartItems = loadCartItems;
// 🚀 EXPÕE A NOVA FUNÇÃO DE CHECKOUT GLOBALMENTE
window.handleCheckout = handleCheckout;