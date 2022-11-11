import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING(320),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    min: 8,
                    max: 64
                }
            },
            about: {
                type: DataTypes.TEXT,
                allowNull: true,
                validate: {
                    max: 1000
                }
            },
            refresh_token: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            is_verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            avatar_url: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            first_name: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            second_name: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            third_name: {
                type: DataTypes.STRING(32),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'users',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'users_email_key',
                    unique: true,
                    fields: [
                        { name: 'email' }
                    ]
                },
                {
                    name: 'users_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
