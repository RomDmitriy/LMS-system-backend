import UserPermission from '../models/user_permission.js';

export default class PermissionController {
    async checkUserPermission(req, res, next) {
        try {
            // получаем данные из body
            const { course_id, permission_id } = req.body;

            // проверка на нормальность данных
            if (isNaN(course_id) || isNaN(permission_id)) {
                res.status(400).end();
                next();
                return;
            }

            const result = await UserPermission.findOne({
                where: {
                    user_id: req.userId,
                    course_id,
                    permission_id,
                },
            });

            // если такого права у пользователя нет
            if (result === null) {
                res.status(404).end();
                next();
                return;
            }

            res.status(200).end();
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }
}
