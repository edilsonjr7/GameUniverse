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
            allowNull: false // Armazenará o HASH
        },
        email_verificado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        data_cadastro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        // fk_tipo_user será definido na associação
    }, {
        tableName: 'Usuario',
        timestamps: false
    });

    Usuario.associate = (models) => {
        // Relacionamento com Tipo_user
        Usuario.belongsTo(models.TipoUser, {
            foreignKey: 'fk_tipo_user',
            as: 'tipoUser'
        });
    };
    return Usuario;
};