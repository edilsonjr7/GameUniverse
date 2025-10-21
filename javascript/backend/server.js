import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importa a configuração de conexão e os modelos do Sequelize
import db from './models/index.js';

// Importa as rotas de autenticação (Login/Cadastro)
import authRoutes from './routes/games.js'; 
// Importa as rotas protegidas (ADM/Usuário)
import userRoutes from './routes/usuario_rotas.js'; 

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



app.get('/api/games', (req, res) => {
  
    const games = [
        { id: 1, title: 'GTA 6', imageUrl: 'imagem/GTA-6.jpg', price: 299.99, genre: 'Ação' },
        { id: 2, title: 'Red Dead Redemption 2', imageUrl: 'imagem/RDR2.jpg', price: 199.99, genre: 'Aventura' },
        { id: 3, title: 'EA SPORTS FC 25', imageUrl: 'imagem/EA-SPORTS-FC-25.jpg', price: 250.00, genre: 'Esporte' },
        { id: 4, title: 'Mortal Kombat 1', imageUrl: 'imagem/Mortal-kombat.jpg', price: 279.99, genre: 'Luta' },
    ];
    res.json(games);
});


// 4. Rota Principal
app.get('/', (req, res) => {
    res.json({ message: "Servidor GameStore Universe em execução." });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});