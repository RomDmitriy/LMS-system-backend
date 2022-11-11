import Course from '../models/course.js';
import CoursesTag from '../models/courses_tag.js';
import Section from '../models/section.js';
import Module from '../models/module.js';
import Category from '../models/category.js';
import UserPermission from '../models/user_permission.js';
import Tag from '../models/tag.js';
import database from '../shared/db-init.js';
import { checkCanEditCourse, checkCanViewCourse, checkIsMentor, givePermission } from '../shared/permissions.js';
import User from '../models/user.js';
import Feedback from '../models/feedback.js';
import Block from '../models/block.js';
import { fn, col, Op } from 'sequelize';

export default class CourseController {
    async createEmptyCourse(req, res, next) {
        try {
            // проверка на наличие право быть ментором
            if (!await checkIsMentor(req.userId)) {
                res.status(401).end();
                next();
                return;
            }

            const course = await Course.create(
                { author_id: req.userId },
                { returning: ['id'] },
            );
            // выдаём право на просмотр курса
            givePermission(req.userId, course.id, 'CAN_VIEW_COURSE');
            // выдаём право на редактирование
            givePermission(req.userId, course.id, 'CAN_EDIT_COURSE');
            // выдаём право на делегацию прав
            givePermission(req.userId, course.id, 'CAN_DELEGATE_PERMISSIONS');
            res.status(201).json({ id: course.id });
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async getCourseEditInfo(req, res, next) {
        try {
            const { course_id } = req.params;
            // если передали что-то не то
            if (isNaN(course_id)) {
                res.status(400).end();
                next();
                return;
            }

            // проверка наличия права на изменение курса
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // получаем курс
            const courseRaw = await Course.findByPk(course_id, { raw: true });
            if (courseRaw === null) {
                res.status(404).end();
                next();
                return;
            }

            const course = Object.assign(courseRaw);

            // получаем теги курса
            course.tags = [];
            const result = await CoursesTag.findAll({
                attributes: ['tag_id'],
                where: {
                    course_id,
                },
            });
            result.forEach(tag_id => {
                course.tags.push(tag_id.tag_id);
            });

            // получаем секции
            const sections = await Section.findAll({
                attributes: ['id', 'local_id', 'title'],
                where: {
                    course_id,
                },
                raw: true,
                order: [['local_id', 'ASC']],
            });

            course.sections = [];
            sections.forEach(section => {
                course.sections.push(section);
            });

            // делаем массив промисов
            const modulesPromises = [];
            for (let i = 0; i < course.sections.length; i++) {
                modulesPromises.push(Module.findAll({
                    attributes: ['local_id', 'title'],
                    where: {
                        section_id: course.sections[i].id,
                    },
                    order: [['local_id', 'ASC']],
                    raw: true,
                }));
            }

            // засовываем данные
            const modules = await Promise.all(modulesPromises);
            for (let i = 0; i < course.sections.length; i++) {
                course.sections[i].modules = modules[i];

                delete course.sections[i].id;
            }

            res.status(200).json(course);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async updateCourse(req, res, next) {
        const t = await database.transaction();
        try {
            // достаём данные из body
            const {
                id,
                user_level,
                is_visible,
                sections,
                category_id,
                tags,
                price,
            } = req.body;
            let { title, description, trailer_url, main_topics, image_url } = req.body;

            // если id не передали или передали плохой
            if (isNaN(id)) {
                await t.rollback();
                res.status(400).end();
                next();
                return;
            }

            // проверка наличия права на изменение курса
            if (!await checkCanEditCourse(req.userId, id)) {
                await t.rollback();
                res.status(403).end();
                next();
                return;
            }

            // проверка а есть ли такой курс вообще
            let course_id = await Course.findByPk(id, {
                attributes: ['id'],
                transaction: t,
            });
            if (course_id === null) {
                await t.rollback();
                res.status(404).end();
                next();
                return;
            }

            let result;
            // если категорию вообще отправили
            if (!isNaN(category_id) && category_id !== null) {
                // проверка на существование категории с таким id
                result = await Category.findByPk(category_id, {
                    transaction: t,
                });
                if (result === null) {
                    await t.rollback();
                    res.status(400).end();
                    next();
                    return;
                }
            }

            // проверка, что sections пришёл массивом
            if (!Array.isArray(sections)) {
                await t.rollback();
                res.status(400).end();
                next();
                return;
            }

            // проверка, что tags пришёл массивом
            if (!Array.isArray(tags)) {
                await t.rollback();
                res.status(400).end();
                next();
                return;
            }

            // проверка на пустоту массива
            if (tags.length !== 0) {
                // проверка на существование тегов с такими id
                result = await Tag.findAll({
                    attributes: ['id'],
                    where: {
                        id: {
                            [Op.in]: tags,
                        },
                    },
                    transaction: t,
                });
                if (result.length !== tags.length) {
                    await t.rollback();
                    res.status(400).end();
                    next();
                    return;
                }
            }

            // проверка количества main_topics
            if (main_topics.length > 5) {
                await t.rollback();
                res.status(400).end();
                next();
                return;
            }

            // чистка строк от лишних пробелов
            try {
                title = title.trim();
                description = description.trim();
                trailer_url = trailer_url.trim();
                image_url = image_url.trim();
                for (let i = 0; i < main_topics.length; i++) {
                    main_topics[i] = main_topics[i].trim();
                }
            } catch (_) {
                // несоответствие полей типу String
                await t.rollback();
                res.status(400).end();
                next();
                return;
            }

            // чистим старые теги
            await CoursesTag.destroy({
                where: {
                    course_id: id,
                },
                transaction: t,
            });

            const tags_objs = [];
            // преобразовываем объект тегов
            for (let i = 0; i < tags.length; i++) {
                tags_objs[i] = {};
                tags_objs[i].course_id = id;
                tags_objs[i].tag_id = tags[i];
            }

            // добавляем теги
            await CoursesTag.bulkCreate(tags_objs, {
                returning: false,
                transaction: t,
            });

            // обновляем курс в БД
            course_id = await Course.update(
                {
                    title,
                    description,
                    trailer_url,
                    user_level,
                    main_topics,
                    image_url,
                    is_visible,
                    price,
                    category_id,
                },
                {
                    where: {
                        id,
                    },
                    transaction: t,
                },
            );

            await t.commit();

            // возвращаем статус успеха
            res.status(200).end();
        } catch (err) {
            await t.rollback();
            // если неправильные параметры
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

    async createSection(req, res, next) {
        try {
            // получаем данные из body
            const { course_id, local_id } = req.body;
            let { title } = req.body;

            // проверяем нормальность этих данных
            if (isNaN(course_id) || isNaN(local_id) || title === undefined) {
                res.status(400).end();
                next();
                return;
            }

            // проверяем право пользователя редактировать данный курс
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // убираем лишние пробелы из названия
            try {
                title = title.trim();
            } catch (_) {
                res.status(400).end();
                next();
                return;
            }

            // создаём секцию
            // с findOrCreate беды, поэтому в две функции
            const section = await Section.findOne({
                where: {
                    course_id,
                    local_id,
                },
                attributes: ['id'],
            });

            // если секции с таким local_id в этом курсе ранее не было
            if (section === null) {
                await Section.create(
                    {
                        course_id,
                        local_id,
                        title,
                    },
                    {
                        returning: false,
                    },
                );

                res.status(201).end();
            } else {
                res.status(409).end();
            }
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async updateSection(req, res, next) {
        try {
            // получаем данные из body
            const { course_id, local_id } = req.body;
            let { title } = req.body;

            // проверяем нормальность этих данных
            if (isNaN(course_id) || isNaN(local_id) || title === undefined) {
                res.status(400).end();
                next();
                return;
            }

            // проверяем право пользователя редактировать данный курс
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // убираем лишние пробелы из названия
            try {
                title = title.trim();
            } catch (_) {
                res.status(400).end();
                next();
                return;
            }

            // обновляем секцию
            // не проверяю занятость local_id, ибо это забота фронта
            await Section.update(
                {
                    title,
                },
                {
                    where: {
                        course_id,
                        local_id,
                    },
                },
            );

            res.status(200).end();
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async deleteSection(req, res, next) {
        try {
            // получаем данные из body
            const { course_id, local_id } = req.body;

            // проверяем нормальность этих данных
            if (isNaN(course_id) || isNaN(local_id)) {
                res.status(400).end();
                next();
                return;
            }

            // проверяем право пользователя редактировать данный курс
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // получаем id секции
            const section = await Section.findOne({
                where: {
                    course_id,
                    local_id,
                },
                attributes: ['id'],
            });

            // получаем модули
            const modules = await Module.findAll({
                where: {
                    section_id: section.id,
                    local_id,
                },
                attributes: ['id'],
            });

            // создаём массив id модулей
            const modulesIds = [];
            modules.forEach(module => {
                modulesIds.push(module.id);
            });

            // удаляем блоки
            await Block.destroy({
                where: {
                    module_id: {
                        [Op.in]: modulesIds,
                    },
                },
            });

            // удаляем модули
            await Module.destroy({
                where: {
                    id: {
                        [Op.in]: modulesIds,
                    },
                },
            });

            // удаляем секцию
            await section.destroy();

            res.status(200).end();
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async createModule(req, res, next) {
        try {
            // получаем данные из body
            const { course_id, section_local_id, local_id } = req.body;
            let { title } = req.body;

            // проверяем нормальность этих данных
            if (isNaN(course_id) || isNaN(section_local_id) || isNaN(local_id) || title === undefined) {
                res.status(400).end();
                next();
                return;
            }

            // проверяем право пользователя редактировать данный курс
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // убираем лишние пробелы из названия
            try {
                title = title.trim();
            } catch (_) {
                res.status(400).end();
                next();
                return;
            }

            // получаем id секции
            const section = await Section.findOne({
                where: {
                    course_id,
                    local_id: section_local_id,
                },
                attributes: ['id'],
            });

            if (section === null) {
                res.status(404).end();
                next();
                return;
            }

            // создаём модуль
            // с findOrCreate беды, поэтому в две функции
            const module = await Module.findOne({
                where: {
                    section_id: section.id,
                    local_id,
                },
                attributes: ['id'],
            });

            // если модуля с таким local_id в этом курсе ранее не было
            if (module === null) {
                await Module.create(
                    {
                        section_id: section.id,
                        local_id,
                        title,
                    },
                    {
                        returning: false,
                    },
                );

                res.status(201).end();
            } else {
                res.status(409).end();
            }
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async updateModule(req, res, next) {
        try {
            // получаем данные из body
            const { course_id, section_local_id, local_id } = req.body;
            let { title } = req.body;

            // проверяем нормальность этих данных
            if (isNaN(course_id) || isNaN(section_local_id) || isNaN(local_id) || title === undefined) {
                res.status(400).end();
                next();
                return;
            }

            // проверяем право пользователя редактировать данный курс
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // убираем лишние пробелы из названия
            try {
                title = title.trim();
            } catch (_) {
                res.status(400).end();
                next();
                return;
            }

            // TODO: сделать очистку неиспользуемых файлов на S3

            // получаем id секции
            const section = await Section.findOne({
                where: {
                    course_id,
                    local_id: section_local_id,
                },
                attributes: ['id'],
            });

            // обновляем модуль
            // на существование модуля не проверяем. Оставляю эту задачу на фронт
            await Module.update({
                title,
            }, {
                where: {
                    section_id: section.id,
                    local_id,
                },
            });
            res.status(200).end();
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async deleteModule(req, res, next) {
        try {
            // получаем данные из body
            const { course_id, section_local_id, local_id } = req.body;

            // проверяем нормальность этих данных
            if (isNaN(course_id) || isNaN(section_local_id) || isNaN(local_id)) {
                res.status(400).end();
                next();
                return;
            }

            // проверяем право пользователя редактировать данный курс
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // получаем id секции
            const section = await Section.findOne({
                where: {
                    course_id,
                    local_id: section_local_id,
                },
                attributes: ['id'],
            });

            // получаем id модуля
            const module = await Module.findOne({
                where: {
                    section_id: section.id,
                    local_id,
                },
                attributes: ['id'],
            });

            // удаляем блоки
            await Block.destroy({
                where: {
                    module_id: module.id,
                },
            });

            // удаляем модуль
            await module.destroy();
            res.status(200).end();
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async getBlocks(req, res, next) {
        try {
            const { course_id, section_local_id, module_local_id } = req.params;

            // проверка переданных данных
            if (
                isNaN(course_id)
                || isNaN(section_local_id)
                || isNaN(module_local_id)
            ) {
                res.status(404).end();
                next();
                return;
            }

            if (!await checkCanViewCourse(req.userId, course_id)) {
                res.status(403).end();
                next();
                return;
            }

            // получаем id секции
            const section = await Section.findOne({
                attributes: ['id'],
                where: {
                    course_id,
                    local_id: section_local_id,
                },
                raw: true,
            });
            if (section === null) {
                res.status(404).end();
                next();
                return;
            }

            // получаем модуль
            const moduleRaw = await Module.findOne({
                attributes: ['id', 'title'],
                where: {
                    section_id: section.id,
                    local_id: module_local_id,
                },
                raw: true,
            });
            if (moduleRaw === null) {
                res.status(404).end();
                next();
                return;
            }

            const module = Object.assign(moduleRaw);

            // получаем блоки
            const blocks = await Block.findAll({
                attributes: ['local_id', 'type_id', 'title', 'content'],
                where: {
                    module_id: moduleRaw.id,
                },
            });

            // записываем в модуль
            module.blocks = blocks === null ? [] : blocks;

            // удаляем id из объекта
            delete module.id;

            res.status(200).json(module);
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async updateBlocks(req, res, next) {
        const t = await database.transaction();
        try {
            const { course_id, section_local_id, module_local_id } = req.body;

            // проверка переданных данных
            if (
                isNaN(course_id)
                || isNaN(section_local_id)
                || isNaN(module_local_id)
            ) {
                res.status(400).end();
                await t.rollback();
                next();
                return;
            }

            // проверка на наличие права на редактирование
            if (!await checkCanEditCourse(req.userId, course_id)) {
                res.status(403).end();
                await t.rollback();
                next();
                return;
            }

            // берём данные модуля
            let { title } = req.body;
            const { blocks } = req.body;
            if (title === undefined || !Array.isArray(blocks)) {
                res.status(400).end();
                await t.rollback();
                next();
                return;
            }

            try {
                title = title.trim();
                // убираем лишние пробелы
                for (let i = 0; i < blocks.length; i++) {
                    blocks[i].title = blocks[i].title.trim();
                    blocks[i].content = blocks[i].content.trim();
                }
            } catch (_) {
                res.status(400).end();
                await t.rollback();
                next();
                return;
            }

            // получаем id секции
            const section = await Section.findOne({
                attributes: ['id'],
                where: {
                    course_id,
                    local_id: section_local_id,
                },
                raw: true,
                transaction: t,
            });
            if (section === null) {
                res.status(404).end();
                await t.rollback();
                next();
                return;
            }

            // обновляем модуль
            const module = await Module.update(
                { title },
                {
                    where: {
                        section_id: section.id,
                        local_id: module_local_id,
                    },
                    returning: ['id'],
                    raw: true,
                    transaction: t,
                },
            );

            // жесть какой костыль, я без понятия почему возвращается галиматья
            const module_id = module[1][0].id;

            // добавляем module_id
            for (let i = 0; i < blocks.length; i++) {
                blocks[i].module_id = module_id;
            }

            // удаляем старые блоки
            await Block.destroy({
                where: {
                    module_id,
                },
                transaction: t,
            });

            // создаём новые
            await Block.bulkCreate(blocks, {
                transaction: t,
            });

            await t.commit();
            res.status(200).json();
        } catch (err) {
            await t.rollback();
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async getCourseById(req, res, next) {
        try {
            // ищем курс
            const { course_id } = req.params;

            const course = await Course.findOne({
                attributes: [
                    'title', 'description', 'author_id', 'trailer_url', 'user_level', 'main_topics', 'image_url', 'is_visible', 'price',
                ],
                where: {
                    id: course_id,
                },
                include: [{
                    model: User,
                    attributes: [
                        ['first_name', 'author_first_name'],
                        ['second_name', 'author_second_name'],
                        ['third_name', 'author_third_name'],
                        ['about', 'author_description'],
                    ],
                }],
                raw: true,
            });

            // если курс не найден
            if (course === null) {
                res.status(404).end();
                next();
                return;
            }

            let canEdit = false;
            let canWatch = false;

            // проверяем права пользователя
            if (req.userId === null) {
                // если курс недоступен публично
                if (course.is_visible === false) {
                    res.status(404).end();
                    next();
                    return;
                }
            } else {
                canWatch = await checkCanViewCourse(req.userId, course_id);
                canEdit = await checkCanEditCourse(req.userId, course_id);
                if (!canEdit && !course.is_visible) {
                    // если курс недоступен публично
                    res.status(404).end();
                    next();
                    return;
                }
            }

            course.can_edit = canEdit;
            course.can_watch = canWatch;

            ['author_first_name', 'author_second_name', 'author_third_name', 'author_description'].forEach(name => {
                course[name] = course['User.' + name];
                delete course['User.' + name];
            });

            // TODO: ЗАГЛУШКА
            course.time = 373;

            // получаем теги курса
            course.tags = [];
            const tagIDsRaw = await CoursesTag.findAll({
                attributes: ['tag_id'],
                where: {
                    course_id,
                },
            });

            const tagIDs = [];
            for (let i = 0; i < tagIDsRaw.length; i++) {
                tagIDs.push(tagIDsRaw[i].tag_id);
            }

            course.tags = await Tag.findAll({
                where: {
                    id: {
                        [Op.in]: tagIDs,
                    },
                },
                attributes: ['title'],
            });

            for (let i = 0; i < course.tags.length; i++) {
                course.tags[i] = course.tags[i].title;
            }

            res.status(200).json(course);
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        }

        next();
    }

    async getHierarchy(req, res, next) {
        const { course_id } = req.params;

        if (isNaN(course_id)) {
            res.status(400).end();
            return;
        }

        const course = await Course.findByPk(course_id, {
            attributes: ['is_visible'],
            raw: true,
        });

        // если курс не найден
        if (course === null) {
            res.status(404).end();
            next();
            return;
        }

        let canEdit = false;

        // проверяем права пользователя
        if (req.userId === null) {
            // если курс недоступен публично
            if (course.is_visible === false) {
                res.status(404).end();
                next();
                return;
            }
        } else {
            canEdit = await checkCanEditCourse(req.userId, course_id);
            if (!canEdit && !course.is_visible) {
                // если курс недоступен публично
                res.status(404).end();
                next();
                return;
            }
        }

        // получаем секции курса
        let sections = await Section.findAll({
            attributes: ['id', 'local_id', 'title'],
            where: {
                course_id,
            },
            raw: true,
        });

        sections = sections.sort((a, b) => a.local_id - b.local_id);

        // делаем промисы для получения модулей
        let modules = [];
        for (let i = 0; i < sections.length; i++) {
            modules.push(Module.findAll({
                attributes: ['id', 'local_id', 'title'],
                where: {
                    section_id: sections[i].id,
                },
                raw: true,
            }));
        }

        // получаем модули
        modules = await Promise.all(modules);

        // делаем промисы для получения блоков
        const blocks = [];
        for (let i = 0; i < sections.length; i++) {
            blocks.push([]);
            for (let j = 0; j < modules[i].length; j++) {
                blocks[i].push(Block.findAll({
                    attributes: ['local_id', 'title'],
                    where: {
                        module_id: modules[i][j].id,
                    },
                    raw: true,
                }));
            }
        }

        // получаем блоки
        for (let i = 0; i < blocks.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            blocks[i] = await Promise.all(blocks[i]);
            blocks[i].sort((a, b) => a.local_id - b.local_id);
        }

        // собираем матрёшку
        for (let i = 0; i < sections.length; i++) {
            delete sections[i].id;
            modules[i].sort((a, b) => a.local_id - b.local_id);
            sections[i].modules = modules[i];
            for (let j = 0; j < modules[i].length; j++) {
                delete sections[i].modules[j].id;
                sections[i].modules[j].blocks = blocks[i][j];
            }
        }

        res.status(200).json(sections);
        next();
    }

    async getPreviews(req, res, next) {
        try {
            // достаём данные из query
            let { count, offset } = req.query;
            count = parseInt(count);
            offset = parseInt(offset);

            // проверяем на то, что передали числа (и что вообще хоть что-то передали). Если нет, то
            if (isNaN(count) || isNaN(offset)) {
                // возвращаем статус Плохой запрос и выходим
                res.status(400).end();
                next();
                return;
            }

            // получаем список курсов
            const properties = {
                attributes: [
                    'id',
                    'image_url',
                    'trailer_url',
                    'title',
                    'description',
                ],
                include: [
                    {
                        model: User,
                        required: true,
                        attributes: [
                            'first_name',
                            'second_name',
                            'third_name',
                        ],
                    },
                ],
                where: {
                    is_visible: true,
                },
                order: [['id', 'ASC']],
                raw: true,
            };

            if (!count === 0) {
                properties.limit = count;
                properties.offset = offset;
            }

            const coursesRaw = await Course.findAll(properties);

            // переносим в свободный объект
            const courses = [];
            coursesRaw.forEach(course => {
                courses.push(course);
            });

            // избавляемся от приписки User у некоторых полей
            for (let i = 0; i < courses.length; i++) {
                ['first_name', 'second_name', 'third_name'].forEach(name => {
                    courses[i]['author_' + name] = courses[i]['User.' + name];
                    delete courses[i]['User.' + name];
                });
            }

            // получаем массив id полученных курсов
            const course_ids = [];
            courses.forEach(course => {
                course_ids.push(course.id);
            });

            // получаем рейтинг
            const ratings = await Feedback.findAll({
                attributes: ['course_id', [fn('AVG', col('mark')), 'rating']],
                group: 'course_id',
                where: {
                    course_id: {
                        [Op.or]: course_ids,
                    },
                },
                order: [['course_id', 'ASC']],
                raw: true,
            });

            // распределяем рейтинг в соответствующие объекты
            for (let i = 0; i < courses.length; i++) {
                // TODO: заглушка
                courses[i].time = 613;

                for (let j = 0; j < ratings.length; j++) {
                    if (courses[i].id === ratings[j].course_id) {
                        courses[i].rating = ratings[j].rating.substr(0, 4);
                    }
                }

                if (courses[i].rating === undefined) {
                    courses[i].rating = null;
                }
            }

            // возвращаем результат со статусом ОК
            res.status(200).json(courses);
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async getCategories(req, res) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }

    async getTags(req, res) {
        try {
            const tags = await Tag.findAll();
            res.status(200).json(tags);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }

    async getCourseQuantity(req, res) {
        try {
            const count = await Course.count({
                where: {
                    is_visible: true,
                },
            });
            res.status(200).json(count);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }

    async getStudentCourses(req, res, next) {
        try {
            const { userId } = req;

            // если передали что-то не то
            if (isNaN(userId)) {
                res.status(400).end();
                next();
                return;
            }

            // получаем
            const permissionsRaw = await UserPermission.findAll({
                attributes: ['course_id'],
                where: {
                    user_id: userId,
                    permission_id: 1,
                },
            });

            // если не найдены курсы с заданными правами
            if (permissionsRaw === null) {
                res.status(404).end();
                next();
                return;
            }

            // переносим в массив
            const courseIds = [];
            permissionsRaw.forEach(permission => {
                courseIds.push(permission.course_id);
            });

            // получаем карточки всех курсов инструктора
            const studentCourses = await Course.findAll({
                attributes: [
                    'id', 'title', 'description', 'author_id', 'trailer_url', 'user_level', 'main_topics', 'image_url', 'is_visible', 'price',
                ],
                where: {
                    id: {
                        [Op.in]: courseIds,
                    },
                },
                include: [{
                    model: User,
                    attributes: [
                        ['first_name', 'author_first_name'],
                        ['second_name', 'author_second_name'],
                        ['third_name', 'author_third_name'],
                        ['about', 'author_description'],
                    ],
                }],
                raw: true,
            });

            for (let i = 0; i < studentCourses.length; i++) {
                // TODO: заглушка
                studentCourses[0].time = 613;

                ['author_first_name', 'author_second_name', 'author_third_name', 'author_description'].forEach(name => {
                    studentCourses[i][name] = studentCourses[i]['User.' + name];
                    delete studentCourses[i]['User.' + name];
                });
            }

            // studentCourses.sort((a, b) => {
            //     return a.id - b.id;
            // });

            res.status(200).json(studentCourses);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async getInstructorCourses(req, res, next) {
        try {
            const { userId } = req;

            // если передали что-то не то
            if (isNaN(userId)) {
                res.status(400).end();
                next();
                return;
            }

            // получаем
            const permissionsRaw = await UserPermission.findAll({
                attributes: ['course_id'],
                where: {
                    user_id: userId,
                    permission_id: 2,
                },
            });

            // если не найдены курсы с заданными правами
            if (permissionsRaw === null) {
                res.status(404).end();
                next();
                return;
            }

            // переносим в массив
            const courseIds = [];
            permissionsRaw.forEach(permission => {
                courseIds.push(permission.course_id);
            });

            // получаем карточки всех курсов инструктора
            const instructorCourses = await Course.findAll({
                attributes: [
                    'id', 'title', 'description', 'author_id', 'trailer_url', 'user_level', 'main_topics', 'image_url', 'is_visible', 'price',
                ],
                where: {
                    id: {
                        [Op.in]: courseIds,
                    },
                },
                include: [{
                    model: User,
                    attributes: [
                        ['first_name', 'author_first_name'],
                        ['second_name', 'author_second_name'],
                        ['third_name', 'author_third_name'],
                        ['about', 'author_description'],
                    ],
                }],
                raw: true,
            });

            for (let i = 0; i < instructorCourses.length; i++) {
                // TODO: заглушка
                instructorCourses[0].time = 613;

                ['author_first_name', 'author_second_name', 'author_third_name', 'author_description'].forEach(name => {
                    instructorCourses[i][name] = instructorCourses[i]['User.' + name];
                    delete instructorCourses[i]['User.' + name];
                });
            }

            instructorCourses.sort((a, b) => a.id - b.id);

            res.status(200).json(instructorCourses);
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async addUserToCourse(req, res, next) {
        try {
            const user_id = req.userId;
            const { course_id } = req.body;

            if (isNaN(user_id) || isNaN(course_id)) {
                res.status(400).end();
                next();
                return;
            }

            const result = await givePermission(user_id, course_id, 'CAN_VIEW_COURSE');

            if (!result) {
                res.status(404).end();
                next();
                return;
            }

            res.status(201).end();
        } catch (err) {
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }

    async setBlockSeen(req, res, next) {
        const t = await database.transaction();
        try {
            const user_id = req.userId;
            const { course_id, section_local_id, module_local_id, block_local_id } = req.body;

            if (isNaN(user_id) || isNaN(course_id) || isNaN(section_local_id) || isNaN(module_local_id) || isNaN(block_local_id)) {
                res.status(400).end();
                await t.rollback();
                next();
                return;
            }

            // получаем текущую секцию
            const current_section = await Section.findOne({
                attributes: ['id'],
                where: {
                    course_id,
                    local_id: section_local_id,
                },
                raw: true,
                transaction: t,
            });

            if (current_section === null) {
                res.status(404).end();
                await t.rollback();
                next();
                return;
            }

            // получаем текущий модуль
            const current_module = await Module.findOne({
                attributes: ['id'],
                where: {
                    section_id: current_section.id,
                    local_id: module_local_id,
                },
                raw: true,
                transaction: t,
            });

            if (current_module === null) {
                res.status(404).end();
                await t.rollback();
                next();
                return;
            }

            // получаем текущий блок
            const current_block = await Block.findOne({
                attributes: ['id'],
                where: {
                    module_id: current_module.id,
                    local_id: block_local_id,
                },
                raw: true,
                transaction: t,
            });

            if (current_block === null) {
                res.status(404).end();
                await t.rollback();
                next();
                return;
            }

            // оставлено до лучших времён (когда БД созреет)
            // await UserBlock.create(
            //     {
            //         user_id: user_id,
            //         block_id: current_block.id,
            //         seen: true
            //     },
            //     {
            //         returning: ['id'],
            //         transaction: t
            //     }
            // );

            await t.commit();
            res.status(201).end();
        } catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).end();
        } finally {
            next();
        }
    }
}
