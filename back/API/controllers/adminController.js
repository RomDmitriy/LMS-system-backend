import Tag from '../models/tag.js';
import Category from '../models/category.js';
import MentorVerifyQuery from '../models/mentor_verify_query.js';
import UserPermission from '../models/user_permission.js';
import database from '../shared/db-init.js';
import { checkIsAdmin } from '../shared/permissions.js';
import User from '../models/user.js';
import { Op } from 'sequelize';

export default class AdminController {
    async addTag(req, res, next) {
        try {
            // проверяем право админа
            if (!await checkIsAdmin(req.userId)) {
                res.status(403).end();
                next();
                return;
            }

            const { new_tag } = req.params;
            await Tag.create({ title: new_tag });
            res.status(201).end();
        } catch (err) {
            // если такой тег уже есть
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(409).end();
                next();
                return;
            }

            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async addCategory(req, res, next) {
        try {
            // проверяем право админа
            if (!await checkIsAdmin(req.userId)) {
                res.status(403).end();
                next();
                return;
            }

            const { new_category } = req.params;
            await Category.create({ title: new_category });
            res.status(201).end();
        } catch (err) {
            // если такая категория уже есть
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(409).end();
                next();
                return;
            }

            // если название слишком длинное
            if (err.name === 'SequelizeValidationError') {
                res.status(400).end();
                next();
                return;
            }

            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async checkMentorOrder(req, res, next) {
        try {
            res.status(200).json({ status: await MentorVerifyQuery.findOne({
                where: {
                    user_id: req.userId,
                },
            }) !== null });
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async getMentorVerifyList(req, res, next) {
        try {
            // проверяем право админа
            if (!await checkIsAdmin(req.userId)) {
                res.status(403).end();
                next();
                return;
            }

            // получаем id менторов
            const userIDsRaw = await MentorVerifyQuery.findAll({
                attributes: ['user_id'],
                raw: true,
            });

            // переделывание в нормальный массив
            const userIDs = [];
            for (let i = 0; i < userIDsRaw.length; i++) {
                userIDs.push(userIDsRaw[i].user_id);
            }

            const users = await User.findAll({
                where: {
                    id: {
                        [Op.in]: userIDs,
                    },
                },
                attributes: ['id', 'email', 'about', 'avatar_url', 'first_name', 'second_name', 'third_name'],
            });

            res.status(200).json(users);
        } catch (err) {
            console.log(err);
        } finally {
            next();
        }
    }

    async acceptMentor(req, res, next) {
        const t = await database.transaction();
        try {
            // проверяем право админа
            if (!await checkIsAdmin(req.userId)) {
                res.status(403).end();
                await t.rollback();
                next();
                return;
            }

            // получаем id того, кого принять
            const { user_id } = req.body;
            if (isNaN(user_id)) {
                res.status(400).end();
                await t.rollback();
                next();
                return;
            }

            // проверка на существование такого пользователя (хз зачем)
            const user = await User.findByPk(user_id, {
                attributes: ['id'],
            });
            if (user === null) {
                res.status(404).end();
                await t.rollback();
                next();
                return;
            }

            // удаляем запрос на менторство
            await MentorVerifyQuery.destroy({
                where: {
                    user_id,
                },
                transaction: t,
            });

            await UserPermission.create({
                user_id,
                permission_id: 6, // костыль, это право ментора
            }, {
                transaction: t,
            });

            await t.commit();
            res.status(200).end();
        } catch (err) {
            await t.rollback();
            console.log(err);
            next();
        } finally {
            next();
        }
    }

    async addUserPermission(req, res, next) {
        try {
            const { user_id, course_id, permission_id } = req.body;
            if (isNaN(parseInt(course_id)) || isNaN(parseInt(user_id)) || isNaN(parseInt(permission_id))) {
                res.status(400).end();
                next();
                return;
            }

            // проверяем право админа
            if (!await checkIsAdmin(req.userId)) {
                res.status(403).end();
                next();
                return;
            }

            // добавляем право в БД
            await UserPermission.create({
                user_id,
                course_id,
                permission_id,
            }, {
                returning: false,
            });

            res.status(201).end();
            next();
        } catch (err) {
            // если такое право уже есть
            switch (err.name) {
            // если беда с foreign key (либо права, либо курса, либо пользователя с таким id нет)
            case 'SequelizeForeignKeyConstraintError': {
                res.status(400).end();
                break;
            }

            // если такое право уже есть
            case 'SequelizeUniqueConstraintError': {
                res.status(409).end();
                break;
            }

            default: {
                console.log(err);
                res.status(500).end();
                break;
            }
            }

            next();
        }
    }
}
