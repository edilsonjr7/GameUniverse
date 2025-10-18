const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Servir arquivos estáticos do front-end
app.use(express.static('..'));

// Rota de exemplo para obter a lista de jogos
app.get('/api/games', (req, res) => {
    const games = [
        { id: 1, title: 'GTA 6', imageUrl: 'imagem/GTA 6.jpg', price: 299.99, genre: 'Ação' },
        { id: 2, title: 'Red Dead Redemption 2', imageUrl: 'imagem/RDR2.jpg', price: 199.99, genre: 'Aventura' },
        { id: 3, title: 'EA SPORTS FC 25', imageUrl: 'imagem/EA SPORTS FC 25.jpg', price: 250.00, genre: 'Esporte' },
        { id: 4, title: 'Mortal Kombat 1', imageUrl: 'imagem/Mortal kombat 1.jpg', price: 279.99, genre: 'Luta' },
    ];
    res.json(games);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});