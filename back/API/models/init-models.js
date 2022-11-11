import _sequelize from 'sequelize';
const DataTypes = _sequelize.DataTypes;
import _Category from './category.js';
import _Course from './course.js';
import _CoursesTag from './courses_tag.js';
import _EmailVerify from './email_verify.js';
import _Feedback from './feedback.js';
import _BlockType from './block_type.js';
import _Block from './block.js';
import _Module from './module.js';
import _PermissionType from './permission_type.js';
import _Section from './section.js';
import _Tag from './tag.js';
import _UserPermission from './user_permission.js';
import _User from './user.js';
import _MentorVerifyQuery from './mentor_verify_query.js';

export default function initModels(sequelize) {
    const Category = _Category.init(sequelize, DataTypes);
    const Course = _Course.init(sequelize, DataTypes);
    const CoursesTag = _CoursesTag.init(sequelize, DataTypes);
    const EmailVerify = _EmailVerify.init(sequelize, DataTypes);
    const Feedback = _Feedback.init(sequelize, DataTypes);
    const BlockType = _BlockType.init(sequelize, DataTypes);
    const Block = _Block.init(sequelize, DataTypes);
    const Module = _Module.init(sequelize, DataTypes);
    const PermissionType = _PermissionType.init(sequelize, DataTypes);
    const Section = _Section.init(sequelize, DataTypes);
    const Tag = _Tag.init(sequelize, DataTypes);
    const UserPermission = _UserPermission.init(sequelize, DataTypes);
    const User = _User.init(sequelize, DataTypes);
    const MentorVerifyQuery = _MentorVerifyQuery.init(sequelize, DataTypes);

    Course.hasMany(Section);
    Section.hasMany(Module);

    // ModuleType скипаю потому что скоро он будет удалён

    Course.belongsTo(User, { foreignKey: 'author_id' });

    Course.belongsTo(Category, { foreignKey: 'category_id' });

    Feedback.belongsTo(User, { foreignKey: 'author_id' });

    Tag.belongsToMany(Course, { through: CoursesTag });
    PermissionType.belongsToMany(User, { through: UserPermission });

    return {
        Category,
        Course,
        CoursesTag,
        EmailVerify,
        Feedback,
        BlockType,
        Block,
        Module,
        PermissionType,
        Section,
        Tag,
        UserPermission,
        User,
        MentorVerifyQuery,
    };
}
