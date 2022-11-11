import _sequelize from 'sequelize';
const { Model } = _sequelize;

export default class MentorVerifyQuery extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true
            }
        }, {
            sequelize,
            tableName: 'mentor_verify_query',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: 'mentor_verify_user_id_unique',
                    unique: true,
                    fields: [
                        { name: 'user_id' }
                    ]
                },
                {
                    name: 'mentor_verify_id_pkey',
                    unique: true,
                    fields: [
                        { name: 'id' }
                    ]
                }
            ]
        });
    }
}
