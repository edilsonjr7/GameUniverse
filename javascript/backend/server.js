import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


// Importe todos os controladores/rotas
import carrinhoRoutes from './routes/carrinhoController.js';
import authRoutes from './routes/usuario_rotas.js';
import userRoutes from './routes/controleAdm.js';
import devRoutes from './routes/devController.js';
import compraRoutes from './routes/compraController.js';


import db from './models/index.js';

dotenv.config(); // Carrega variáveis de ambiente (.env)

// testando as variaveis
console.log("🔍 Testando variáveis de ambiente:");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.PORT);
console.log("Arquivo .env carregado?");
console.log("DB_USER real:", process.env.DB_USER);


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());



app.use(express.static('../../'));


// --- Conexão e Sincronização com o Banco de Dados (Sequelize) ---
db.sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o MySQL estabelecida com sucesso.');

        return db.sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("Modelos sincronizados com o banco de dados.");
        
        // Se a sincronização for bem-sucedida, o servidor DEVE INICIAR AQUI
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

    })
    .catch(err => {
        console.error('ERRO CRÍTICO: Conexão/sincronização do banco de dados:', err.message);
        console.error('Verifique seu arquivo .env e se o MySQL está rodando.');
    });


// --- Rotas API ---

// Rotas de Autenticação (Login e Cadastro)
app.use('/api/auth', authRoutes);

// Rotas de Gerenciamento de Usuários (ADM)
app.use('/api/user', userRoutes);

app.use('/api/dev', devRoutes);

// Conectar o controlador de carrinho na rota '/api/cart'
app.use('/api/cart', carrinhoRoutes);

app.use('/api/compra', compraRoutes);


// Rota para carregar jogos (Rota Aberta/Pública)
app.get('/api/games', async (req, res) => {
    try {
        const games = await db.Jogos.findAll({
            attributes: ['id_jogos', 'titulo', 'genero', 'preco', 'imageUrl']
        });
        // Mapeia para o formato que o frontend espera (id, title, price)
        const mappedGames = games.map(g => ({
            id: g.id_jogos,
            title: g.titulo,
            price: parseFloat(g.preco),
            imageUrl: g.imageUrl
        }));
        res.json(mappedGames);
    } catch (error) {
        console.error("ERRO CRÍTICO AO BUSCAR JOGOS DO BANCO:", error.message);
        res.status(500).json({ message: "Erro ao carregar lista de jogos (Falha no Servidor)." });
    }
});


// Rota Principal: Serve o index.html
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../../' });
});
