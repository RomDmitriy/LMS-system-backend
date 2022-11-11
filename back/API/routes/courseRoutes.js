import { Router } from 'express';
import CourseController from '../controllers/courseController.js';
import { jwtCheckAccessToken, jwtCheckAdditionalAccessToken } from '../middleware/jwtMiddleware.js';
import { logger } from '../middleware/logMiddleware.js';
const coursesRouter = Router();
const courseController = new CourseController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Block:
 *       type: object
 *       required:
 *         - module_id
 *         - local_id
 *         - type_id
 *         - title
 *         - content
 *       properties:
 *         module_id:
 *           type: integer
 *           description: ID модуля.
 *         local_id:
 *           type: integer
 *           description: local ID блока в модуле.
 *         type_id:
 *           type: integer
 *           enum:
 *             - 1
 *             - 2
 *             - 3
 *             - 4
 *           description: ID типа блока.
 *         title:
 *           type: string
 *           description: Наименование блока. Будет показываться на превью странице курса.
 *         content:
 *           type: string
 *           description: Контент блока.
 *       example:
 *         module_id: 234
 *         local_id: 0
 *         type_id: 1
 *         content: "<h1>Aaaaaa</h1>"
 *     Section:
 *       type: object
 *       required:
 *         - course_id
 *         - local_id
 *         - title
 *       properties:
 *         course_id:
 *           type: integer
 *           description: ID курса.
 *         local_id:
 *           type: integer
 *           description: local ID секции в курсе.
 *         title:
 *           type: string
 *           description: Название секции.
 *       example:
 *         course_id: 60
 *         local_id: 4
 *         title: "Testo"
 *
 *     Module:
 *       type: object
 *       required:
 *         - local_id
 *         - course_id
 *         - section_local_id
 *         - title
 *       properties:
 *         local_id:
 *           type: integer
 *           description: local ID модуля в секции.
 *         course_id:
 *           type: integer
 *           description: ID курса.
 *         section_local_id:
 *           type: integer
 *           description: ID секции, в которой находится модуль.
 *         title:
 *           type: string
 *           description: Название модуля.
 *       example:
 *         local_id: 0
 *         course_id: 60
 *         section_local_id: 0
 *         title: "О вреде HTML кода в качестве контента"
 *
 *     Preview:
 *       type: object
 *       required:
 *         - id
 *         - image_url
 *         - trailer_url
 *         - title
 *         - author_first_name
 *         - author_second_name
 *         - author_third_name
 *         - description
 *         - rating
 *         - time
 *       properties:
 *         id:
 *           type: integer
 *           description: ID курса.
 *         image_url:
 *           type: string
 *           description: Ссылка на изображение для карточки.
 *         trailer_url:
 *           type: string
 *           description: Ссылка на трейлер курса.
 *         title:
 *           type: string
 *           description: Название курса.
 *         author_first_name:
 *           type: string
 *           description: Имя автора курса.
 *         author_second_name:
 *           type: string
 *           description: Фамилия автора курса.
 *         author_third_name:
 *           type: string
 *           description: Отчество автора курса.
 *         description:
 *           type: string
 *           description: Описание курса.
 *         rating:
 *           type: string
 *           description: Рейтинг курса.
 *         time:
 *           type: integer
 *           description: Время прохождения курса.
 *       example:
 *         id: 53
 *         image_url: "https://img3.eadaily.com/r650x650/o/a53/97bc8920b846b239b11614d2992d1.jpeg"
 *         trailer_url: "https://www.youtube.com/watch?v=R81F4iWCq88"
 *         title: "Уроки пивоварения."
 *         author_first_name: "Иван"
 *         author_second_name: "Иванов"
 *         author_third_name: "Иванович"
 *         description: "Инновационный курс пивоварения, разработанный специально для студентов НГТУ!"
 *         rating: "4.00"
 *         time: 613
 *
 *     CourseEdit:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - trailer_url
 *         - user_level
 *         - main_topics
 *         - image_url
 *         - is_visible
 *         - price
 *         - category_id
 *         - tags
 *         - sections
 *       properties:
 *         id:
 *           type: integer
 *           description: ID курса.
 *         title:
 *           type: string
 *           description: Название курса.
 *         description:
 *           type: string
 *           description: Полное описание курса.
 *         trailer_url:
 *           type: string
 *           description: Ссылка на трейлер курса.
 *         user_level:
 *           type: string
 *           enum:
 *             - "1"
 *             - "2"
 *             - "3"
 *           description: Сложность курса.
 *         main_topics:
 *           type: string[]
 *           description: Основные моменты, которые будут изучены в курсе.
 *         image_url:
 *           type: string
 *           description: Ссылка на изображение курса.
 *         is_visible:
 *           type: boolean
 *           description: Виден ли курс пользователям.
 *         price:
 *           type: integer
 *           description: Цена курса.
 *         category_id:
 *           type: integer
 *           description: ID категории.
 *         tags:
 *           type: integer[]
 *           description: Массив id тегов.
 *         sections:
 *           type: object[]
 *           description: Массив секций.
 *           required:
 *             - local_id
 *             - title
 *             - description
 *             - modules
 *           properties:
 *             local_id:
 *               type: integer
 *               description: ID секции в данном курсе.
 *             title:
 *               type: string
 *               description: Название секции.
 *             description:
 *               type: string
 *               description: Описание секции.
 *             modules:
 *               type: object[]
 *               description: Массив модулей.
 *               required:
 *                 - local_id
 *                 - title
 *               properties:
 *                 local_id:
 *                   type: integer
 *                   description: ID модуля в данной секции.
 *                 title:
 *                   type: string
 *                   description: Название модуля.
 *       example:
 *         id: 24
 *         title: Уроки пивоварения.
 *         description: Инновационный курс пивоварения, разработанный специально для студентов НГТУ!
 *         author_id: 2
 *         trailer_url: https://www.youtube.com/watch?v=R81F4iWCq88
 *         user_level: "1"
 *         main_topics: ["Пиво безалкогольное", "Квас безалкогольный"]
 *         image_url: https://img3.eadaily.com/r650x650/o/a53/97bc8920b846b239b11614d2992d1.jpeg
 *         is_visible: true
 *         price: 5000
 *         category_id: 0
 *         tags: [1]
 *         sections: [{
 *           local_id: 0,
 *           title: "Секция 1. Варка сусла.",
 *           description: "Данный блок посвящён варке сусла.",
 *           modules: [{
 *             local_id: 0,
 *             title: "Как подготовить сусло?"
 *           },
 *           {
 *             local_id: 1,
 *             title: "Как хранить сусло?"
 *           }]
 *         }]
 *
 *     TagOrCategory:
 *       type: object
 *       required:
 *         - id
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: ID тега/категории.
 *         title:
 *           type: string
 *           description: Наименование тега/категории.
 *     UserToCourse:
 *       type: object
 *       required:
 *         - course_id
 *       properties:
 *         course_id:
 *           type: integer
 *           description: ID курса, на который добавляется пользователь.
 *       example:
 *         course_id: 58
 */

/**
 * @swagger
 * /course/create:
 *   post:
 *    summary: Создать курс-пустышку.
 *    tags: [Course]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      201:
 *        description: Курс успешно добавлен.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: integer
 *                description: ID нового курса.
 *            example:
 *              id: 24
 *
 *      401:
 *        description: Access token истёк.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.post('/create', jwtCheckAccessToken, courseController.createEmptyCourse, logger);

/**
 * @swagger
 * /course/getEditInfo/{course_id}:
 *   get:
 *    summary: Получить информацию о курсе для её дальнейшего редактирования.
 *    tags: [Course]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: course_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID курса.
 *        default: 47
 *    responses:
 *      200:
 *        description: Возвращает полную информацию о курсе.
 *        content:
 *          application/json:
 *            schema: {$ref: '#/components/schemas/CourseEdit'}
 *      400:
 *        description: Неправильные параметры запроса.
 *      403:
 *        description: У пользователя нет прав на редактирование курса.
 *      404:
 *        description: Курса с таким ID не найдено.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get(
    '/getEditInfo/:course_id', jwtCheckAccessToken, courseController.getCourseEditInfo, logger);

/**
 * @swagger
 * /course/section:
 *   post:
 *    summary: Создать секцию.
 *    tags: [Course - Section]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: {$ref: '#/components/schemas/Section'}
 *    responses:
 *      201:
 *        description: Секция создана.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя с таким Access Token нет права редактировать курс.
 *      409:
 *        description: Секция с таким local_id у этого курса уже есть.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.post('/section/', jwtCheckAccessToken, courseController.createSection, logger);

/**
 * @swagger
 * /course/module:
 *   post:
 *    summary: Создать модуль.
 *    tags: [Course - Module]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: {$ref: '#/components/schemas/Module'}
 *    responses:
 *      201:
 *        description: Модуль создан.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя с таким Access Token нет права редактировать курс.
 *      404:
 *        description: Секции с таким local_id в этом курсе нет.
 *      409:
 *        description: Секция с таким local_id у этого курса уже есть.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.post('/module/', jwtCheckAccessToken, courseController.createModule, logger);

/**
 * @swagger
 * /course/section:
 *   put:
 *    summary: Обновить секцию.
 *    tags: [Course - Section]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: {$ref: '#/components/schemas/Section'}
 *    responses:
 *      200:
 *        description: Секция обновлена.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя с таким Access Token нет права редактировать курс.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.put('/section/', jwtCheckAccessToken, courseController.updateSection, logger);

/**
 * @swagger
 * /course/module:
 *   put:
 *    summary: Обновить модуль.
 *    tags: [Course - Module]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: {$ref: '#/components/schemas/Module'}
 *    responses:
 *      200:
 *        description: Модуль обновлён.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя с таким Access Token нет права редактировать курс.
 *      500:
 *        description: Необработанная ошибка.
 */

coursesRouter.put('/module/', jwtCheckAccessToken, courseController.updateModule, logger);

/**
 * @swagger
 * /course/section:
 *   delete:
 *    summary: Удалить секцию.
 *    tags: [Course - Section]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - course_id
 *              - local_id
 *            properties:
 *              course_id:
 *                type: integer
 *                description: ID курса.
 *              local_id:
 *                type: integer
 *                description: local ID секции в курсе.
 *            example:
 *              course_id: 60
 *              local_id: 4
 *    responses:
 *      200:
 *        description: Секция удалена.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя с таким Access Token нет права редактировать курс.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.delete('/section/', jwtCheckAccessToken, courseController.deleteSection, logger);

/**
 * @swagger
 * /course/module:
 *   delete:
 *    summary: Удалить модуль.
 *    tags: [Course - Module]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - local_id
 *              - course_id
 *              - section_local_id
 *            properties:
 *              local_id:
 *                type: integer
 *                description: local ID модуля в секции.
 *              course_id:
 *                type: integer
 *                description: ID курса.
 *              section_local_id:
 *                type: integer
 *                description: ID секции, в которой находится модуль.
 *            example:
 *              local_id: 0
 *              course_id: 60
 *              section_local_id: 0
 *    responses:
 *      200:
 *        description: Модуль обновлён.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя с таким Access Token нет права редактировать курс.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.delete('/module/', jwtCheckAccessToken, courseController.deleteModule, logger);

/**
 * @swagger
 * /course/blocks/{course_id}/{section_local_id}/{module_local_id}:
 *   get:
 *    summary: Получить блоки.
 *    tags: [Course - Blocks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: course_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID курса.
 *        default: 47
 *      - in: path
 *        name: section_local_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: local ID секции.
 *        default: 0
 *      - in: path
 *        name: module_local_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: local ID модуля.
 *        default: 0
 *    responses:
 *      200:
 *        description: Возвращает блоки.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - title
 *                - blocks
 *              properties:
 *                blocks:
 *                  type: array
 *                  items:
 *                    anyOf:
 *                      - {$ref: '#/components/schemas/Block'}
 *              example:
 *                title: Абоба
 *                blocks: [{local_id: 0, type_id: 1, title: "Default Title", content: "<h1>Aaaaaa</h1>"}]
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: Нет прав на просмотр курса.
 *      404:
 *        description: Модуля с такими параметрами не найдено.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/blocks/:course_id/:section_local_id/:module_local_id', jwtCheckAccessToken, courseController.getBlocks, logger);

/**
 * @swagger
 * /course/blocks:
 *   put:
 *    summary: Обновить блоки.
 *    tags: [Course - Blocks]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - blocks
 *              - module_local_id
 *              - course_id
 *              - section_local_id
 *            properties:
 *              title:
 *                type: string
 *                description: Название модуля.
 *              module_local_id:
 *                type: integer
 *                description: local ID модуля в секции.
 *              course_id:
 *                type: integer
 *                description: ID курса.
 *              section_local_id:
 *                type: integer
 *                description: ID секции, в которой находится модуль.
 *              blocks:
 *                type: array
 *                items:
 *                  anyOf:
 *                    - {$ref: '#/components/schemas/Block'}
 *            example:
 *              title: Абоба
 *              course_id: 60
 *              section_local_id: 0
 *              module_local_id: 0
 *              blocks: [{local_id: 0, type_id: 1, title: "Название блока", content: "<h1>Aaaaaa</h1>"}]
 *    responses:
 *      200:
 *        description: Блоки обновлёны.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя нет прав на редактирование курса.
 *      404:
 *        description: Модуля с такими параметрами не найдено.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.put('/blocks', jwtCheckAccessToken, courseController.updateBlocks, logger);

/**
 * @swagger
 * /course/update:
 *   put:
 *    summary: Обновить курс.
 *    tags: [Course]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: {$ref: '#/components/schemas/CourseEdit'}
 *    responses:
 *      200:
 *        description: Курс успешно обновлён.
 *      400:
 *        description: Неправильные параметры запроса. Также возможно, что категория с таким id не существует.
 *      401:
 *        description: Access token истёк.
 *      403:
 *        description: У пользователя нет прав на редактирование курса.
 *      404:
 *        description: Курс с таким ID не найден.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.put('/update', jwtCheckAccessToken, courseController.updateCourse, logger);

/**
 * @swagger
 * /course/page/{course_id}:
 *  get:
 *    summary: Получить страницу курса.
 *    tags: [Course]
 *    security:
 *      - bearerAdditionalAuth: []
 *    parameters:
 *      - in: path
 *        name: course_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID курса.
 *    responses:
 *      200:
 *        description: Возвращает объект курса.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - id
 *                - title
 *                - description
 *                - author_id
 *                - author_first_name
 *                - author_second_name
 *                - author_third_name
 *                - author_description
 *                - trailer_url
 *                - user_level
 *                - main_topics
 *                - image_url
 *                - is_visible
 *                - can_edit
 *                - can_watch
 *                - price
 *                - time
 *                - tags
 *              properties:
 *                id:
 *                  type: string
 *                  description: ID курса.
 *                title:
 *                  type: string
 *                  description: Название курса.
 *                description:
 *                  type: string
 *                  description: Полное описание курса.
 *                author_id:
 *                  type: integer
 *                  description: ID автора курса.
 *                trailer_url:
 *                  type: string
 *                  description: Ссылка на трейлер курса.
 *                user_level:
 *                  type: string
 *                  enum:
 *                    - "1"
 *                    - "2"
 *                    - "3"
 *                  description: Сложность курса.
 *                image_url:
 *                  type: string
 *                  description: Ссылка на изображение курса.
 *                is_visible:
 *                  type: boolean
 *                  description: Виден ли курс тем, у кого нет на него прав.
 *                can_edit:
 *                  type: boolean
 *                  description: Может ли данный пользователь редактировать этот курс.
 *                can_watch:
 *                  type: boolean
 *                  description: Записан ли этот пользователь на данный курс.
 *                price:
 *                  type: integer
 *                  description: Цена курса.
 *                main_topics:
 *                  type: string[]
 *                  description: Основные моменты, которые будут изучены в курсе.
 *                author_first_name:
 *                  type: string
 *                  description: Имя автора курса.
 *                author_second_name:
 *                  type: string
 *                  description: Фамилия автора курса.
 *                author_third_name:
 *                  type: string
 *                  description: Отчество автора курса.
 *                author_description:
 *                  type: string
 *                  description: Описание автора курса.
 *                time:
 *                  type: integer
 *                  description: Время прохождения курса в минутах.
 *                tags:
 *                  type: string[]
 *                  description: Теги курса.
 *              example:
 *                id: 24
 *                title: Уроки пивоварения.
 *                description: Инновационный курс пивоварения, разработанный специально для студентов НГТУ!
 *                author_id: 6
 *                author_first_name: "Иван"
 *                author_second_name: "Иванов"
 *                author_third_name: "Иванович"
 *                author_description: "Автор серии книг 'Как варить?'."
 *                trailer_url: https://www.youtube.com/watch?v=R81F4iWCq88
 *                user_level: 1
 *                image_url: "https://www.youtube.com/watch?v=R81F4iWCq88"
 *                is_visible: true
 *                can_edit: false
 *                price: 5000
 *                time: 373
 *                tags: ["Angular", "Vue.js"]
 *                main_topics: ["Пиво безалкогольное", "Квас безалкогольный"]
 *      404:
 *        description: Курс с таким ID не найден.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/page/:course_id', jwtCheckAdditionalAccessToken, courseController.getCourseById, logger);

/**
 * @swagger
 * /course/hierarchy/{course_id}:
 *  get:
 *    summary: Получить иерархию курса.
 *    tags: [Course]
 *    security:
 *      - bearerAdditionalAuth: []
 *    parameters:
 *      - in: path
 *        name: course_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID курса.
 *    responses:
 *      200:
 *        description: Возвращает иерархию.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - sections
 *              properties:
 *                sections:
 *                  type: object[]
 *                  description: Массив секций.
 *                  required:
 *                    - local_id
 *                    - title
 *                    - description
 *                    - modules
 *                  properties:
 *                    local_id:
 *                      type: integer
 *                      description: ID секции в данном курсе.
 *                    title:
 *                      type: string
 *                      description: Название секции.
 *                    description:
 *                      type: string
 *                      description: Описание секции.
 *                    modules:
 *                      type: object[]
 *                      description: Массив модулей.
 *                      required:
 *                        - local_id
 *                        - title
 *                        - blocks
 *                      properties:
 *                        local_id:
 *                          type: integer
 *                          description: ID модуля в данной секции.
 *                        title:
 *                          type: string
 *                          description: Название модуля.
 *                        blocks:
 *                          type: array
 *                          items:
 *                            anyOf:
 *                              - {$ref: '#/components/schemas/Block'}
 *              example:
 *                [{
 *                  local_id: 1,
 *                  title: "Секция 1. Варка сусла.",
 *                  description: "Данный блок посвящён варке сусла.",
 *                  modules: [{
 *                    local_id: 0,
 *                    title: "Как подготовить сусло?",
 *                    blocks: [{
 *                      local_id: 0,
 *                      type_id: 1,
 *                      title: "Абоба"
 *                    }]
 *                  },
 *                  {
 *                    local_id: 1,
 *                    title: "Как хранить сусло?",
 *                    blocks: [{
 *                      local_id: 0,
 *                      type_id: 1,
 *                      title: "Абоба"
 *                    }]
 *                  }]
 *                }]
 *      404:
 *        description: Курс с таким ID не найден.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/hierarchy/:course_id', jwtCheckAdditionalAccessToken, courseController.getHierarchy, logger);

/**
 * @swagger
 * /course/previews:
 *   get:
 *    summary: Получить некоторое количество карточек курса.
 *    tags: [Course]
 *    parameters:
 *      - in: query
 *        name: count
 *        schema:
 *          type: integer
 *        required: true
 *        description: Количество получаемых карточек курса. 0 - получить все.
 *        default: 0
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *        required: true
 *        description: Смещение относительно всех курсов.
 *        default: 0
 *    responses:
 *      200:
 *        description: Возврат массива курсов.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                anyOf:
 *                  - {$ref: '#/components/schemas/Preview'}
 *
 *      400:
 *        description: Неправильные параметры запроса.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/previews', courseController.getPreviews, logger); // получение нескольких карточек курсов

/**
 * @swagger
 * /course/tags:
 *   get:
 *    summary: Получить массив тегов.
 *    tags: [Utilities]
 *    responses:
 *      200:
 *        description: Возврат массива тегов и их id.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                anyOf:
 *                  - {$ref: '#/components/schemas/TagOrCategory'}
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/tags', courseController.getTags, logger); // получение массива тегов

/**
 * @swagger
 * /course/categories:
 *   get:
 *    summary: Получить массив категорий.
 *    tags: [Utilities]
 *    responses:
 *      200:
 *        description: Возврат массива категорий и их id.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                anyOf:
 *                  - {$ref: '#/components/schemas/TagOrCategory'}
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/categories', courseController.getCategories, logger); // получение массива категорий

/**
 * @swagger
 * /course/coursesQuantity:
 *   get:
 *    summary: Получить количество курсов.
 *    tags: [Utilities]
 *    responses:
 *      200:
 *        description: Возвращает число курсов в БД.
 *        content:
 *          application/json:
 *            schema:
 *              type: integer
 *              example: 24
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/coursesQuantity', courseController.getCourseQuantity, logger);

/**
 * @swagger
 * /course/studentCourses:
 *   get:
 *    summary: Получить курсы студента.
 *    tags: [Utilities]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Возвращает карточки курсов студентов.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                anyOf:
 *                  - {$ref: '#/components/schemas/Preview'}
 *      400:
 *        description: Неправильные параметры запроса.
 *      404:
 *        description: Курсов для данного инструктора не найдено.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/studentCourses', jwtCheckAccessToken, courseController.getStudentCourses, logger);

/**
 * @swagger
 * /course/instructorCourses:
 *   get:
 *    summary: Получить курсы инструктора.
 *    tags: [Utilities]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Возвращает карточки курсов инструктора.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                anyOf:
 *                  - {$ref: '#/components/schemas/Preview'}
 *      400:
 *        description: Неправильные параметры запроса.
 *      404:
 *        description: Курсов для данного инструктора не найдено.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.get('/instructorCourses', jwtCheckAccessToken, courseController.getInstructorCourses, logger);

/**
 * @swagger
 * /course/addUserToCourse:
 *   post:
 *    summary: Добавить пользователя на курс.
 *    tags: [Utilities]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: {$ref: '#/components/schemas/UserToCourse'}
 *    responses:
 *      201:
 *        description: Пользователь успешно добавлен.
 *      400:
 *        description: Неправильные параметры запроса.
 *      404:
 *        description: Пользователь уже добавлен на курс.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.post('/addUserToCourse', jwtCheckAccessToken, courseController.addUserToCourse, logger);

/**
 * @swagger
 * /course/setBlockSeen:
 *   post:
 *    summary: Записать блок пройденным.
 *    tags: [Utilities]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - course_id
 *              - section_local_id
 *              - module_local_id
 *              - block_local_id
 *            properties:
 *              course_id:
 *                type: integer
 *                description: ID курса.
 *              section_local_id:
 *                type: integer
 *                description: ID секции, в которой находится блок.
 *              module_local_id:
 *                type: integer
 *                description: local ID модуля в секции.
 *              block_local_id:
 *                type: integer
 *                description: local ID блока в модуле.
 *            example:
 *              course_id: 58
 *              section_local_id: 0
 *              module_local_id: 0
 *              block_local_id: 0
 *    responses:
 *      201:
 *        description: Запись о прохождении блока успешно добавлена.
 *      400:
 *        description: Неправильные параметры запроса.
 *      404:
 *        description: Секция/модуль/блок по переданным значениям не найдены.
 *      500:
 *        description: Необработанная ошибка.
 */
coursesRouter.post('/setBlockSeen', jwtCheckAccessToken, courseController.setBlockSeen, logger);

export default coursesRouter;
