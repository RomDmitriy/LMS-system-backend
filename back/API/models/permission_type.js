import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class PermissionType extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'permission_types',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'Permissions_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
