import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class CoursesTag extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            course_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            tag_id: {
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
            tableName: 'courses_tags',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'courses_tags_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
