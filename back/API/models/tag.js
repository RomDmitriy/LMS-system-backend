import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Tag extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING(16),
                allowNull: false,
                validate: {
                    max: 16
                }
            }
        }, {
            sequelize,
            tableName: 'tags',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'tags_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                },
                {
                    name: 'title_unique',
                    unique: true,
                    fields: [
                        { name: 'title' }
                    ]
                }
            ]
        });
    }
}
