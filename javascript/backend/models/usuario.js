export default (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_usuario'
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        // Campo FK que liga ao Tipo_user
        fk_tipo_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email_verificado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        data_cadastro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    
    }, {
        tableName: 'Usuario',
        timestamps: false
    });

    Usuario.associate = (models) => {
        
        // 1. RELACIONAMENTO OBRIGATÓRIO: Usuário pertence a um TipoUser (para ADM/DEV)
        Usuario.belongsTo(models.TipoUser, {
            foreignKey: 'fk_tipo_user',
            as: 'tipoUser' // Alias usado no login e nos middlewares ADM/DEV
        });

        // 2. Jogos Comprados (Biblioteca do usuário) - MANTER APENAS ESTA VERSÃO
        Usuario.belongsToMany(models.Jogos, {
            through: 'usuario_jogos',
            foreignKey: 'fk_usuario',
            otherKey: 'fk_jogos',
            as: 'biblioteca', // Alias único para a biblioteca
            timestamps: false
        });
        
        // 3. Jogos postados por este usuário (Desenvolvedor)
        Usuario.hasMany(models.Jogos, {
            foreignKey: 'fk_desenvolvedor',
            as: 'jogosPostados'
        });
        
        // 4. Carrinho (Para buscar os itens do usuário no carrinho)
        Usuario.hasMany(models.Carrinho, {
            foreignKey: 'fk_usuario',
            as: 'itensCarrinho'
        });

      
    };
    return Usuario;
};
