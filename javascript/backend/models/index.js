// [index.js] - CORRIGIDO E FINALIZADO PARA O NOVO ESQUEMA

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from './config/bd.config.js'; 

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importa Modelos
import TipoUserModel from './tipo_use.js';
import UsuarioModel from './usuario.js';
import JogosModel from './jogos.js';
import CarrinhoModel from './carrinho_model.js';

db.TipoUser = TipoUserModel(sequelize, DataTypes);
db.Usuario = UsuarioModel(sequelize, DataTypes);
db.Jogos = JogosModel(sequelize, DataTypes);
db.Carrinho = CarrinhoModel(sequelize, DataTypes); // Adiciona o modelo Carrinho ao DB



// Isso é vital para criar as chaves estrangeiras (FKs) na ordem correta.
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


// Seed inicial do TipoUser e Jogos (Rodar apenas se a tabela estiver vazia)
db.sequelize.sync({ alter: true }).then(async () => { 
    // OBS: O 'force: true' apaga e recria o banco a cada execução.
    // Troque para { alter: true } APÓS o primeiro sucesso.

    // --- SEEDING DE TIPOS DE USUÁRIO ---
    const tipoUserCount = await db.TipoUser.count();
    if (tipoUserCount === 0) {
        console.log("Inserindo Tipos de Usuário iniciais...");
        await db.TipoUser.bulkCreate([
            // Os dados inseridos aqui alinham com os campos 'adm' e 'developer' dos modelos JS.
            { id_tipo_user: 1, nome_tipo: 'Cliente Comum', adm: false, developer: false }, 
            { id_tipo_user: 2, nome_tipo: 'Administrador', adm: true, developer: false },
            { id_tipo_user: 3, nome_tipo: 'Desenvolvedor', adm: false, developer: true } 
        ]);
        console.log("Tipos de Usuário inseridos.");
    }
    
    // --- SEEDING DE JOGOS ---
    const jogosCount = await db.Jogos.count();
    if (jogosCount === 0) {
        console.log("Inserindo Jogos iniciais...");
        await db.Jogos.bulkCreate([
            
            { id_jogos: 1, titulo: 'GTA 5', genero: 'Ação', preco: 8.99, imageUrl: 'imagem/gta5.jpg', descricao: 'Ação pura', data_lancamento: '2025-01-01', status: 'Lançamento' },
            { id_jogos: 2, titulo: 'Red Dead Redemption 2', genero: 'Aventura', preco: 5.12, imageUrl: 'imagem/RDR2.jpg', descricao: 'Faroeste épico', data_lancamento: '2018-10-26', status: 'Disponível' },
            { id_jogos: 3, titulo: 'EA SPORTS FC 25', genero: 'Esporte', preco: 5.84, imageUrl: 'imagem/EA-SPORTS-FC-25.jpg', descricao: 'Futebol com IA', data_lancamento: '2024-09-27', status: 'Disponível' },
            { id_jogos: 4, titulo: 'Mortal Kombat 1', genero: 'Luta', preco: 8.39, imageUrl: 'imagem/Mortal-kombat.jpg', descricao: 'Reboot da franquia', data_lancamento: '2023-09-14', status: 'Disponível' },
        ]);
        console.log("Jogos inseridos.");
    }

}).catch(err => {
    console.error("ERRO na sincronização e seeding:", err.message);
});


export default db;
