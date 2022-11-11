import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Module extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            local_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            section_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'modules',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'content_items_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
