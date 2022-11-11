import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Block extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            module_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            local_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            type_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'blocks',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'block_id_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
