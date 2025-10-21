// tipo_user.model.js
export default (sequelize, DataTypes) => {
    const TipoUser = sequelize.define('TipoUser', {
        id_tipo_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'id_tipo_user'
        },
        nome_tipo: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        adm: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // Dev foi ignorado por simplicidade, mas pode ser adicionado
    }, {
        tableName: 'Tipo_user',
        timestamps: false
    });
    return TipoUser;
};