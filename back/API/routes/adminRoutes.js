import { Router } from 'express';
import AdminController from '../controllers/adminController.js';
import { jwtCheckAccessToken } from '../middleware/jwtMiddleware.js';
import { logger } from '../middleware/logMiddleware.js';

const adminRouter = Router();
const adminController = new AdminController();

/**
 * @swagger
 * components:
 *   schemas:
 *     MentorCard:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - about
 *         - avatar_url
 *         - first_name
 *         - second_name
 *         - third_name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID пользователя.
 *         email:
 *           type: string
 *           description: Email пользователя.
 *         about:
 *           type: string
 *           description: Информация о пользователе.
 *         avatar_url:
 *           type: string
 *           description: Ссылка на аватар пользователя.
 *         first_name:
 *           type: string
 *           description: Имя пользователя.
 *         second_name:
 *           type: string
 *           description: Фамилия пользователя.
 *         third_name:
 *           type: string
 *           description: Отчество пользователя.
 *       example:
 *         id: 24
 *         email: ivnov@mail.ru
 *         about: null
 *         avatar_url: null
 *         first_name: Иван
 *         second_name: Иванов
 *         third_name: Иванович
*/

/**
 * @swagger
 * /admin/tags/{new_tag}:
 *   post:
 *    summary: Добавить новый тег.
 *    tags: [Admin]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: new_tag
 *        schema:
 *          type: string
 *        required: true
 *        description: Название нового тега.
 *    responses:
 *      201:
 *        description: Тег успешно добавлен.
 *      400:
 *        description: Тег слишком длинный.
 *      409:
 *        description: Такой тег уже существует.
 *      500:
 *        description: Необработанная ошибка.
 */
adminRouter.post('/tags/:new_tag', adminController.addTag, logger);

/**
 * @swagger
 * /admin/categories/{new_category}:
 *   post:
 *    summary: Добавить новую категорию.
 *    tags: [Admin]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: new_category
 *        schema:
 *          type: string
 *        required: true
 *        description: Название новой категории.
 *    responses:
 *      201:
 *        description: Категория успешно добавлена.
 *      409:
 *        description: Такая категория уже существует.
 *      500:
 *        description: Необработанная ошибка.
 */
adminRouter.post('/categories/:new_category', adminController.addCategory, logger);

/**
 * @swagger
 * /admin/mentor_verify_list:
 *  get:
 *    summary: Получить список менторов на очереди.
 *    tags: [Admin - Mentors]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Отправка списка менторов на подтверждение.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                anyOf:
 *                  - {$ref: '#/components/schemas/MentorCard'}
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя нет прав администратора.
 *      500:
 *        description: Необработанная ошибка.
 */
adminRouter.get('/mentor_verify_list', jwtCheckAccessToken, adminController.getMentorVerifyList, logger);

/**
 * @swagger
 * /admin/check_mentor_order:
 *  get:
 *    summary: Проверить состоит ли пользователь в очереди на менторство
 *    tags: [Admin - Mentors]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Успешно.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - status
 *              properties:
 *                status:
 *                  type: boolean
 *                  description: Состоит ли пользователь в очереди на менторство.
 *              example:
 *                status: true
 *      400:
 *        description: Токен отсутствует.
 *      401:
 *        description: Refresh токен уже недействителен.
 *      500:
 *        description: Необработанная ошибка.
 */
adminRouter.get('/check_mentor_order', jwtCheckAccessToken, adminController.checkMentorOrder, logger);

/**
 * @swagger
 * /admin/acceptMentor:
 *  put:
 *    summary: Подтвердить ментора.
 *    tags: [Admin - Mentors]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - user_id
 *            properties:
 *              course_id:
 *                type: integer
 *                description: ID пользователя, которого надо подтвердить.
 *            example:
 *              user_id: 34
 *    responses:
 *      200:
 *        description: Ментор успешно подтверждён.
 *      401:
 *        description: Проблемы с Access Token.
 *      403:
 *        description: У пользователя нет прав администратора.
 *      500:
 *        description: Необработанная ошибка.
 */
adminRouter.put('/acceptMentor', jwtCheckAccessToken, adminController.acceptMentor, logger);

/**
 * @swagger
 * /auth/addPermission:
 *  post:
 *    summary: Выдать право пользователю на курс
 *    tags: [Admin]
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
 *              - user_id
 *              - permission_id
 *            properties:
 *              course_id:
 *                type: integer
 *                description: ID нужного курса.
 *              user_id:
 *                type: integer
 *                description: ID пользователя.
 *              permission_id:
 *                type: integer
 *                description: ID нужного права. //TODO пните бэк, чтобы он написал запрос для получения списка прав.
 *            example:
 *              course_id: 1
 *              user_id: 1
 *              permission_id: 1
 *    responses:
 *      201:
 *        description: Право успешно выдано.
 *      400:
 *        description: Неправильные параметры в теле запроса. Либо права, либо курса, либо пользователя с таким id нет
 *      409:
 *        description: У пользователя уже есть это право на курс с таким id.
 *      500:
 *        description: Необработанная ошибка.
 */
adminRouter.post('/addPermission/', jwtCheckAccessToken, adminController.addUserPermission, logger);

export default adminRouter;
