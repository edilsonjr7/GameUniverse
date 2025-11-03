// backend/models/tipo_usu.js
export default (sequelize, DataTypes) => {
    const TipoUser = sequelize.define('TipoUser', {
        id_tipo_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            // Remova autoIncrement (IDs fixos 1,2,3)
        },
        nome_tipo: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        adm: {  // Nome amigável no JS
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_adm'  // ← Mapeia para a coluna do banco
        },
        developer: {  // Nome amigável no JS
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_dev'  // ← Mapeia para a coluna do banco
        }
    }, {
        tableName: 'Tipo_user',
        timestamps: false
    });
    return TipoUser;
};