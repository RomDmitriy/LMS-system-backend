import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class Course extends Model {
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
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            author_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            trailer_url: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            main_topics: {
                type: DataTypes.ARRAY(DataTypes.TEXT),
                allowNull: true
            },
            image_url: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            is_visible: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            user_level: {
                type: DataTypes.ENUM('0', '1', '2', '3'),
                allowNull: true,
                defaultValue: '0',
                validate: {
                    isIn: {
                        args: [['0', '1', '2', '3']]
                    }
                }
            }
        }, {
            sequelize,
            tableName: 'courses',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'courses_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
