import UserPermission from '../models/user_permission.js';

const permissions = {
    CAN_VIEW_COURSE: 1,
    CAN_EDIT_COURSE: 2,
    CAN_DELEGATE_PERMISSIONS: 3,
    CAN_CHECK_HOMEWORK: 4,
    ADMINISTRATOR: 5,
    MENTOR: 6,
};

export async function checkCanViewCourse(user_id, course_id) {
    if (isNaN(user_id) || isNaN(course_id)) {
        throw Error('UserID or CourseID is NaN!');
    }

    const result = await UserPermission.findOne({
        attributes: ['id'],
        where: {
            user_id,
            course_id,
            permission_id: permissions.CAN_VIEW_COURSE,
        },
    });

    return result !== null;
}

export async function checkCanEditCourse(user_id, course_id) {
    if (isNaN(user_id) || isNaN(course_id)) {
        throw Error('UserID or CourseID is NaN!');
    }

    const result = await UserPermission.findOne({
        attributes: ['id'],
        where: {
            user_id,
            course_id,
            permission_id: permissions.CAN_EDIT_COURSE,
        },
    });

    return result !== null;
}

export async function checkIsAdmin(user_id) {
    if (isNaN(user_id)) {
        throw Error('UserID is NaN!');
    }

    const result = await UserPermission.findOne({
        attributes: ['id'],
        where: {
            user_id,
            permission_id: permissions.ADMINISTRATOR,
        },
    });
    return result !== null;
}

export async function checkIsMentor(user_id) {
    if (isNaN(user_id)) {
        throw Error('UserID is NaN!');
    }

    const result = await UserPermission.findOne({
        where: {
            user_id,
            permission_id: permissions.MENTOR,
        },
        attributes: ['id'],
    });
    return result !== null;
}

export async function givePermission(user_id, course_id, permission) {
    if (isNaN(user_id) || isNaN(course_id)) {
        throw Error('UserID or CourseID is NaN!');
    }

    try {
        const result = await UserPermission.create(
            {
                user_id,
                course_id,
                permission_id: permissions[permission],
            },
            { returning: ['id'] },
        );

        return result !== null;
    } catch (_) {
        return false;
    }
}
