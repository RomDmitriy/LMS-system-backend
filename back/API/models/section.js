import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Section extends Model {
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
            local_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'sections',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'sections_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
