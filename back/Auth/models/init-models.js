import _sequelize from 'sequelize';
const DataTypes = _sequelize.DataTypes;
import _EmailVerify from './email_verify.js';
import _UserPermission from './user_permission.js';
import _User from './user.js';
import _PermissionType from './permission_type.js';
import _MentorVerifyQuery from './mentor_verify_query.js';

export default function initModels(sequelize) {
    const EmailVerify = _EmailVerify.init(sequelize, DataTypes);
    const UserPermission = _UserPermission.init(sequelize, DataTypes);
    const User = _User.init(sequelize, DataTypes);
    const PermissionType = _PermissionType.init(sequelize, DataTypes);
    const MentorVerifyQuery = _MentorVerifyQuery.init(sequelize, DataTypes);


    return {
        EmailVerify,
        UserPermission,
        User,
        PermissionType,
        MentorVerifyQuery
    };
}
