import { Router } from 'express';
import PermissionController from '../controllers/permissionController.js';
import { jwtCheckAccessToken } from '../middleware/jwtMiddleware.js';
import { logger } from '../middleware/logMiddleware.js';

const permissionRouter = Router();
const permissionController = new PermissionController();

/**
 * @swagger
 * /permission/check:
 *  get:
 *    summary: Проверить наличие права на курс у пользователя
 *    tags: [Permissions]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - course_id
 *              - permission_id
 *            properties:
 *              course_id:
 *                type: integer
 *                description: ID нужного курса.
 *              permission_id:
 *                type: integer
 *                description: ID права.
 *            example:
 *              course_id: 60
 *              permission_id: 2
 *    responses:
 *      200:
 *        description: Такое право у пользователя есть.
 *      400:
 *        description: Неправильные параметры в теле запроса.
 *      401:
 *        description: Проблемы с Access Token.
 *      404:
 *        description: Такого права у пользователя нет.
 *      500:
 *        description: Необработанная ошибка.
 */
permissionRouter.get('/check', jwtCheckAccessToken, permissionController.checkUserPermission, logger);

export default permissionRouter;
