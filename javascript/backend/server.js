import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importa a configuração de conexão e os modelos do Sequelize
import db from './models/index.js';

// Importa as rotas de autenticação (Login/Cadastro)
import authRoutes from './routes/usuario_rotas.js'; 
// Importa as rotas protegidas (ADM/Usuário)
import userRoutes from './routes/controleAdm.js'; 

dotenv.config(); // Carrega variáveis de ambiente (.env)

// testando as variaveis
console.log("🔍 Testando variáveis de ambiente:");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Permite requisições do frontend (necessário para desenvolvimento)
app.use(express.json()); //Aqui processar JSON nas requisições POST/PUT


app.use(express.static('../..')); 


// --- Conexão e Sincronização com o Banco de Dados (Sequelize) ---
db.sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o MySQL estabelecida com sucesso.');
       
        return db.sequelize.sync({ alter: true }); 
    })
    .then(() => {
        console.log("Modelos sincronizados com o banco de dados.");
        
    })
    .catch(err => {
        console.error('ERRO na conexão/sincronização do banco de dados:', err.message);
    });


// --- Rotas API ---

// Rotas de Autenticação (Login e Cadastro)
app.use('/api/auth', authRoutes);

//  Rotas Protegidas (ADM e Usuário)
app.use('/api/user', userRoutes);


app.get('/api/games', async (req, res) => {
    try {
        // Assume que db.Jogos existe e a busca é válida
        const games = await db.Jogos.findAll({
            // Buscando APENAS os campos essenciais para evitar erro de JOIN desnecessário
            attributes: ['id_jogos', 'titulo', 'genero', 'preco', 'imageUrl'] 
        });
        res.json(games);
    } catch (error) {
        // CRÍTICO: Imprime o erro REAL no terminal para diagnóstico
        console.error("ERRO CRÍTICO AO BUSCAR JOGOS DO BANCO:", error.message); 
        res.status(500).json({ message: "Erro ao carregar lista de jogos (Falha no Servidor)." });
    }
});


// 4. Rota Principal
app.get('/', (req, res) => {
    res.json({ message: "Servidor GameStore Universe em execução." });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});