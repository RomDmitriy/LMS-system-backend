import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class BlockType extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            type: {
                type: DataTypes.STRING(16),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'block_types',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'block_types_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
