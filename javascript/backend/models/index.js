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

    // --- SEEDING DE TIPOS DE USUÁRIO ---
    const tipoUserCount = await db.TipoUser.count();
    if (tipoUserCount === 0) {
        console.log("Inserindo Tipos de Usuário iniciais...");
        await db.TipoUser.bulkCreate([
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
            
            { 
                id_jogos: 1, 
                titulo: 'GTA 5', 
                genero: 'Ação', 
                preco: 6.89, 
                imageUrl: 'imagem/gta5.jpg', 
                descricao: 'Ação e mundo aberto em Los Santos.', 
                data_lancamento: '2013-09-17', 
                status: 'Disponível',
                requisitos_minimo: 'Intel Core 2 Quad Q6600, 4GB RAM, 90GB HDD.',
                requisitos_recomendado: 'Intel Core i5, 8GB RAM, GTX 970, 90GB SSD.'
            },
            { 
                id_jogos: 2, 
                titulo: 'Red Dead Redemption 2', 
                genero: 'Aventura', 
                preco: 12.45, 
                imageUrl: 'imagem/RDR2.jpg', 
                descricao: 'Faroeste épico de Arthur Morgan no Velho Oeste.', 
                data_lancamento: '2018-10-26', 
                status: 'Disponível',
                requisitos_minimo: 'Intel Core i5-2500K, 8GB RAM, 150GB HDD.',
                requisitos_recomendado: 'Intel Core i7-4770K, 12GB RAM, GTX 1060, 150GB SSD.'
            },
            { 
                id_jogos: 3, 
                titulo: 'EA SPORTS FC 25', 
                genero: 'Esporte', 
                preco: 25.99, 
                imageUrl: 'imagem/EA-SPORTS-FC-25.jpg', 
                descricao: 'Futebol realista com tecnologia HyperMotion.', 
                data_lancamento: '2024-09-27', 
                status: 'Disponível',
                requisitos_minimo: 'Core i5 6600k, 8GB RAM, Placa de vídeo GTX 1050Ti.',
                requisitos_recomendado: 'Core i7 6700, 12GB RAM, RTX 2070.'
            },
            { 
                id_jogos: 4, 
                titulo: 'Mortal Kombat 1', 
                genero: 'Luta', 
                preco: 5.36, 
                imageUrl: 'imagem/Mortal-kombat.jpg', 
                descricao: 'Reboot da franquia de luta sangrenta.', 
                data_lancamento: '2023-09-14', 
                status: 'Disponível',
                requisitos_minimo: 'Intel Core i5-6600K, 8GB RAM, GTX 980, 100GB SSD.',
                requisitos_recomendado: 'Intel Core i7-8700K, 16GB RAM, RTX 3070, 100GB SSD.'
            },
            // NOVAS CATEGORIAS INCLUÍDAS
            { 
                id_jogos: 5, 
                titulo: 'Silent Hill 2 Remake', 
                genero: 'Terror', 
                preco: 10.50, 
                imageUrl: 'imagem/silent_hill.jpg', 
                descricao: 'Terror psicológico em uma cidade enevoada.', 
                data_lancamento: '2025-05-01', 
                status: 'Lançamento',
                requisitos_minimo: 'Core i5, 10GB RAM, GTX 1070, 50GB SSD.',
                requisitos_recomendado: 'Core i7, 16GB RAM, RTX 3080, 50GB SSD.'
            },
            { 
                id_jogos: 6, 
                titulo: 'Forza Motorsport', 
                genero: 'Corrida', 
                preco: 22.00, 
                imageUrl: 'imagem/forza_motorsport.jpg', 
                descricao: 'Simulador de corrida de última geração.', 
                data_lancamento: '2023-10-10', 
                status: 'Disponível',
                requisitos_minimo: 'Ryzen 3 / Core i5-8400, 8GB RAM, GTX 1060, 130GB SSD.',
                requisitos_recomendado: 'Ryzen 7 / Core i7-10700k, 16GB RAM, RTX 3080, 130GB SSD.'
            },
        ]);
        console.log("Jogos inseridos.");
    }

}).catch(err => {
    console.error("ERRO na sincronização e seeding:", err.message);
});


export default db;
