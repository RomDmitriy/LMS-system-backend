import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class EmailVerify extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            token: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            expiration_time: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'email_verify',
            schema: 'public',
            timestamps: false
        });
    }
}
