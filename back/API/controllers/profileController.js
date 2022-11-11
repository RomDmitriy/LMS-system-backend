import User from '../models/user.js';

export default class ProfileController {
    async getProfileByID(req, res, next) {
        try {
            const { user_id } = req.params;
            // проверка user_id на число
            if (user_id === undefined || isNaN(parseInt(user_id))) {
                res.status(400).end();
                next();
                return;
            }

            // получаем инфу о профиле
            const profile = await User.findByPk(user_id, {
                attributes: ['email', 'first_name', 'second_name', 'third_name', 'avatar_url', 'about'],
                raw: true,
            });

            // если пользователя с таким id нет
            if (profile === null) {
                res.status(404).end();
                next();
                return;
            }

            res.status(200).json(profile);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async getProfileByToken(req, res, next) {
        try {
            // получаем инфу о профиле
            const profile = await User.findByPk(req.userId, {
                attributes: ['email', 'first_name', 'second_name', 'third_name', 'avatar_url', 'about'],
                raw: true,
            });

            // если пользователя с таким id нет
            if (profile === null) {
                res.status(404).end();
                next();
                return;
            }

            res.status(200).json(profile);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async updateProfileInformation(req, res, next) {
        try {
            // парсим информацию из тела запроса
            let newInfo = {
                first_name: req.body.first_name,
                second_name: req.body.second_name,
                third_name: req.body.third_name,
                avatar_url: req.body.avatar_url,
                about: req.body.about,
            };

            // убираем пустые поля
            newInfo = JSON.parse(JSON.stringify(newInfo));

            // обновляем информацию в БД
            await User.update(newInfo, {
                where: {
                    id: req.userId,
                },
            });

            res.status(200).end();
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }
}
