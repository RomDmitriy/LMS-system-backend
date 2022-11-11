import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Feedback extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            course_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            author_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            mark: {
                type: DataTypes.DECIMAL,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'feedbacks',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'feedbacks_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
