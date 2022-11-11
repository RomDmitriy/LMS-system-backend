import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class UserPermission extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            course_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }
        }, {
            sequelize,
            tableName: 'user_permissions',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'unique_permissions',
                    unique: true,
                    fields: [
                        { name: 'user_id' },
                        { name: 'course_id' },
                        { name: 'permission_id' }
                    ]
                },
                {
                    name: 'user_permissions_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
