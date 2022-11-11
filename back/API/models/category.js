import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Category extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'categories',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'categories_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                },
                {
                    name: 'title',
                    unique: true,
                    fields: [
                        { name: 'title' }
                    ]
                }
            ]
        });
    }
}
