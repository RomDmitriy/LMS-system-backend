import bcrypt from 'bcrypt';
import MentorVerifyQuery from '../models/mentor_verify_query.js';
import User from '../models/user.js';
import UserPermission from '../models/user_permission.js';
import database from '../shared/db-init.js';
import { generateTokens } from '../shared/jwt.js';

export default class AuthController {
    async createUser(req, res, next) {
        const t = await database.transaction();
        try {
            let { email, first_name, second_name, third_name, password } = req.body;
            const { is_mentor } = req.body;

            // удаляем лишние пробелы
            try {
                email = email.trim();
                first_name = first_name.trim();
                second_name = second_name.trim();
                third_name = third_name.trim();
                password = password.trim();
            } catch (_) {
                res.status(400).end();
                await t.rollback();
                next();
                return;
            }

            // добавляем пользователя в БД
            const newUser = await User.create({
                email,
                first_name,
                second_name,
                third_name,
                password: bcrypt.hashSync(String(password), bcrypt.genSaltSync()),
            }, {
                transaction: t,
                returning: ['id'],
            });

            // генерируем токены
            const tokens = generateTokens(newUser.id);

            // если это новый ментор
            if (is_mentor) {
                // создаём запрос на принятие
                await MentorVerifyQuery.create({
                    user_id: newUser.id,
                }, {
                    transaction: t,
                });
            }

            // обновляем токен в БД
            await User.update({
                refresh_token: tokens.refresh_token,
            }, {
                where: {
                    id: newUser.id,
                },
                returning: false,
                transaction: t,
            });

            // если пользователь добавлен успешно, то возвращаем токены
            await t.commit();
            res.status(201).json(tokens);
        } catch (err) {
            await t.rollback();
            switch (err.name) {
            case 'SequelizeUniqueConstraintError': {
                // если email уже занят
                res.status(409).end();
                break;
            }

            case 'SequelizeValidationError': {
                // если проблема с запросом (например, длина неподходящая)
                res.status(400).end();
                break;
            }

            default: {
                // если необработанная ошибка
                console.log(err);
                res.status(500).end();
                break;
            }
            }
        } finally {
            next();
        }
    }

    async userAuthentication(req, res, next) {
        try {
            const { email, password } = req.query;

            // ищем пользователя и получаем его пароль
            const user = await User.findOne({
                attributes: ['id', 'password'],
                where: {
                    email,
                },
            });

            // если пользователь найден
            if (user === null) {
                // если пользователь с таким email не найден
                res.status(404).end();
                next();
            } else if (bcrypt.compareSync(password, user.password)) {
                // проверяем правильность пароля
                // генерируем новые токены
                const tokens = generateTokens(user.id);

                // получаем ментор ли пользователь
                const is_mentor = await UserPermission.findOne({
                    where: {
                        user_id: user.id,
                        permission_id: 6, // костыль, это право ментора
                    },
                });
                tokens.is_mentor = is_mentor !== null;

                // обновляем refresh_token в БД
                await User.update({ refresh_token: tokens.refresh_token }, {
                    where: {
                        email,
                    },
                    returning: false,
                });

                // если успешно обновлили, то возвращаем токены
                res.status(200).json(tokens);
                next();
            } else {
                // если пароль неправильный
                res.status(401).end();
                next();
            }
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
            next();
        }
    }

    async userAuthenticationPost(req, res, next) {
        try {
            const { email, password } = req.body;

            // ищем пользователя и получаем его пароль
            const user = await User.findOne({
                attributes: ['id', 'password'],
                where: {
                    email,
                },
            });

            // если пользователь найден
            if (user === null) {
                // если пользователь с таким email не найден
                res.status(404).end();
                next();
            } else if (bcrypt.compareSync(password, user.password)) {
                // проверяем правильность пароля
                // генерируем новые токены
                const tokens = generateTokens(user.id);

                // получаем ментор ли пользователь
                const is_mentor = await UserPermission.findOne({
                    where: {
                        user_id: user.id,
                        permission_id: 6, // костыль, это право ментора
                    },
                });
                tokens.is_mentor = is_mentor !== null;

                // обновляем refresh_token в БД
                await User.update({ refresh_token: tokens.refresh_token }, {
                    where: {
                        email,
                    },
                    returning: false,
                });

                // если успешно обновлили, то возвращаем токены
                res.status(200).json(tokens);
                next();
            } else {
                // если пароль неправильный
                res.status(401).end();
                next();
            }
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
            next();
        }
    }

    async updateTokens(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            // генерируем токены
            const newTokens = generateTokens(req.userId);

            const refresh_token_in_DB = await User.findOne({
                attributes: ['refresh_token'],
                where: {
                    id: req.userId,
                },
            });

            await User.update({
                refresh_token: newTokens.refresh_token,
            }, {
                where: {
                    id: req.userId,
                },
                returning: false,
            });

            // // получаем ментор ли пользователь
            // const is_mentor = await UserPermission.findOne({
            //     where: {
            //         user_id: req.userId,
            //         permission_id: 6 // костыль, это право ментора
            //     }
            // });

            if (refresh_token_in_DB.refresh_token === token) {
                // newTokens.is_mentor = is_mentor !== null;
                res.status(200).json(newTokens);
            } else {
                res.status(401).end();
                next();
                return;
            }
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        }

        next();
    }

    async logout(req, res) {
        try {
            await User.update({
                refresh_token: null,
            }, {
                where: {
                    id: req.userId,
                },
            });
            res.status(200).end();
        } catch (err) {
            console.log(err);
        }
    }
}
