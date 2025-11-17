export default (sequelize, DataTypes) => {
    const Carrinho = sequelize.define('Carrinho', {
        fk_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'fk_usuario'
        },
        fk_jogos: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'fk_jogos'
        },
        data_adicao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Carrinho',
        timestamps: false
    });

    Carrinho.associate = (models) => {
        Carrinho.belongsTo(models.Usuario, { foreignKey: 'fk_usuario' });
        Carrinho.belongsTo(models.Jogos, { foreignKey: 'fk_jogos' });
    };

    return Carrinho;
};
