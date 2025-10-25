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
        },
        developer: {  // ← note: no banco é "dev", mas no JS use "developer" para clareza
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'dev' // ← mapeia o campo do banco
} 
    }, {
        tableName: 'Tipo_user',
        timestamps: false
    });
    return TipoUser;
};