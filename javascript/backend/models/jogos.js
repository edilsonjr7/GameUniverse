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
        genero: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING(255),
            allowNull: true // aqui guardamos a URL da imagem
        }
        // Adicionar outros campos como 'descricao', 'data_lancamento', 'status' podem ser adicionados aqui
    }, {
        tableName: 'Jogos',
        timestamps: false
    });
    return Jogos;
};