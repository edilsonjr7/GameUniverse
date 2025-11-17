// backend/models/Jogos.js
export default (sequelize, DataTypes) => {
    const Jogos = sequelize.define('Jogos', {
        id_jogos: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_jogos'
        },
        titulo: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        genero: DataTypes.STRING(45),
        descricao: DataTypes.TEXT,
        preco: DataTypes.DECIMAL(10, 2),
        data_lancamento: DataTypes.DATEONLY,
        status: DataTypes.STRING(100),
        
        
        imageUrl: { 
            type: DataTypes.STRING(255), // URL de imagem
            allowNull: true
        }, 
        

        requisitos_minimo: {
            type: DataTypes.TEXT,
            allowNull: true // Permite que o campo seja nulo se o dev não preencher
        },
        requisitos_recomendado: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // ------------------------------------
        
        fk_desenvolvedor: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'Jogos',
        timestamps: false
    });
    
    Jogos.associate = (models) => {
        Jogos.belongsTo(models.Usuario, {
            foreignKey: 'fk_desenvolvedor',
            as: 'desenvolvedor'
        });

        Jogos.belongsToMany(models.Usuario, {
            through: 'usuario_jogos',
            foreignKey: 'fk_jogos',
            otherKey: 'fk_usuario',
            as: 'compradores',
            timestamps: false
        });
    };
    return Jogos;
};