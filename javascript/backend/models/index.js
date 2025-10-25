// aqui vai ser o ponto de entrada dos dados
// criar a conexão, carrega os modelos e suas associações.

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from './config/bd.config.js'; // Conexão

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importa Modelos
import TipoUserModel from './tipo_use.js';
import UsuarioModel from './usuario.js';
import JogosModel from './jogos.js';


db.TipoUser = TipoUserModel(sequelize, DataTypes);
db.Usuario = UsuarioModel(sequelize, DataTypes);
db.Jogos = JogosModel(sequelize, DataTypes);

// Configura Associações (Foreign Keys)
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


// Seed inicial do TipoUser (Rodar apenas se a tabela estiver vazia)
db.sequelize.sync({ alter: true }).then(async () => { // Adicionado alter: true
    const count = await db.TipoUser.count();
    if (count === 0) {
        console.log("Inserindo Tipos de Usuário iniciais...");
        await db.TipoUser.bulkCreate([
            // Usamos FALSE/TRUE (que o Sequelize mapeia para 0/1 no BOOLEAN)
            { id_tipo_user: 1, nome_tipo: 'Cliente Comum', adm: false, developer: false }, 
            { id_tipo_user: 2, nome_tipo: 'Administrador', adm: true, developer: false },
            { id_tipo_user: 3, nome_tipo: 'Desenvolvedor', adm: false, developer: true } 
        ]);
        console.log("Tipos de Usuário inseridos.");
    }
});

db.sequelize.sync().then(async () => {
    const count = await db.Jogos.count();
    if (count === 0) {
        console.log("Inserindo Jogos iniciais...");
        await db.Jogos.bulkCreate([
            { id_jogos: 1, titulo: 'GTA 6', genero: 'Ação', preco: 299.99, imageUrl: 'imagem/GTA-6.jpg' },
            { id_jogos: 2, titulo: 'Red Dead Redemption 2', genero: 'Aventura', preco: 199.99, imageUrl: 'imagem/RDR2.jpg' },
            { id_jogos: 3, titulo: 'EA SPORTS FC 25', genero: 'Esporte', preco: 250.00, imageUrl: 'imagem/EA-SPORTS-FC-25.jpg' },
            { id_jogos: 4, titulo: 'Mortal Kombat 1', genero: 'Luta', preco: 279.99, imageUrl: 'imagem/Mortal-kombat.jpg' },
        ]);
        console.log("Jogos inseridos.");
    }
}).catch(err => {
    console.error("ERRO na sincronização e seeding:", err.message);
});


export default db;