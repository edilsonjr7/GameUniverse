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
// (Aqui EU adiciono os  Jogos, Carrinho, Avaliacao, etc.)

db.TipoUser = TipoUserModel(sequelize, DataTypes);
db.Usuario = UsuarioModel(sequelize, DataTypes);

// Configura Associações (Foreign Keys)
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Seed inicial do TipoUser (Rodar apenas se a tabela estiver vazia)
db.sequelize.sync().then(async () => {
    const count = await db.TipoUser.count();
    if (count === 0) {
        console.log("Inserindo Tipos de Usuário iniciais...");
        await db.TipoUser.bulkCreate([
            { id_tipo_user: 1, nome_tipo: 'Cliente Comum', adm: false },
            { id_tipo_user: 2, nome_tipo: 'Administrador', adm: true }
        ]);
        console.log("Tipos de Usuário inseridos.");
    }
}).catch(err => {
    console.error("Erro na sincronização e seeding:", err.message);
});


export default db;