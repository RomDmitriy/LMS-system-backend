import { Router } from 'express';
import ProfileController from '../controllers/profileController.js';
import { jwtCheckAccessToken } from '../middleware/jwtMiddleware.js';
import { logger } from '../middleware/logMiddleware.js';

const profileRouter = Router();
const profileController = new ProfileController();

/**
 * @swagger
 * /profile/by_id/{user_id}:
 *   get:
 *    summary: Получить информацию о пользователе.
 *    tags: [Profile]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *        description: ID пользователя.
 *    responses:
 *      200:
 *        description: Возвращает информацию о профиле пользователя.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - first_name
 *                - second_name
 *                - third_name
 *                - avatar_url
 *                - about
 *              properties:
 *                email:
 *                  type: string
 *                  description: Электронная почта пользователя.
 *                first_name:
 *                  type: string
 *                  description: Имя пользователя.
 *                second_name:
 *                  type: string
 *                  description: Фамилия пользователя.
 *                third_name:
 *                  type: string
 *                  description: Отчество пользователя.
 *                avatar_url:
 *                  type: string
 *                  description: URL аватарки пользователя.
 *                about:
 *                  type: string
 *                  description: Информация о себе.
 *              example:
 *                email: "ivanov@mail.ru"
 *                first_name: "Иван"
 *                second_name: "Иванов"
 *                third_name: "Иванович"
 *                avatar_url: "https://media.discordapp.net/attachments/753320814010433626/1009098059013173248/unknown.png"
 *                about: "Люблю квас"
 *      404:
 *        description: Пользователя с таким ID нет.
 *      500:
 *        description: Необработанная ошибка.
 */
profileRouter.get('/by_id/:user_id', profileController.getProfileByID, logger);

/**
 * @swagger
 * /profile/by_token/:
 *   get:
 *    summary: Получить информацию о пользователе.
 *    tags: [Profile]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Возвращает информацию о профиле пользователя.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - first_name
 *                - second_name
 *                - third_name
 *                - avatar_url
 *                - about
 *              properties:
 *                email:
 *                  type: string
 *                  description: Электронная почта пользователя.
 *                first_name:
 *                  type: string
 *                  description: Имя пользователя.
 *                second_name:
 *                  type: string
 *                  description: Фамилия пользователя.
 *                third_name:
 *                  type: string
 *                  description: Отчество пользователя.
 *                avatar_url:
 *                  type: string
 *                  description: URL аватарки пользователя.
 *                about:
 *                  type: string
 *                  description: Информация о себе.
 *              example:
 *                email: "ivanov@mail.ru"
 *                first_name: "Иван"
 *                second_name: "Иванов"
 *                third_name: "Иванович"
 *                avatar_url: "https://media.discordapp.net/attachments/753320814010433626/1009098059013173248/unknown.png"
 *                about: "Люблю квас"
 *      401:
 *        description: Проблемы с токеном.
 *      404:
 *        description: Пользователя с таким ID нет.
 *      500:
 *        description: Необработанная ошибка.
 */
profileRouter.get('/by_token', jwtCheckAccessToken, profileController.getProfileByToken, logger);

/**
 * @swagger
 * /profile/update/:
 *   put:
 *    summary: Обновить информацию о пользователе.
 *    tags: [Profile]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - first_name
 *              - second_name
 *              - third_name
 *              - avatar_url
 *              - about
 *            properties:
 *              first_name:
 *                type: string
 *                description: Имя пользователя.
 *              second_name:
 *                type: string
 *                description: Фамилия пользователя.
 *              third_name:
 *                type: string
 *                description: Отчество пользователя.
 *              avatar_url:
 *                type: string
 *                description: URL аватарки пользователя.
 *              about:
 *                type: string
 *                description: Информация о себе.
 *            example:
 *              first_name: "Иван"
 *              second_name: "Иванов"
 *              third_name: "Иванович"
 *              avatar_url: "https://media.discordapp.net/attachments/753320814010433626/1009098059013173248/unknown.png"
 *              about: "Люблю квас"
 *    responses:
 *      200:
 *        description: Информация о профиле пользователя обновлена.
 *      401:
 *        description: Проблемы с токеном.
 *      404:
 *        description: Пользователя с таким ID нет.
 *      500:
 *        description: Необработанная ошибка.
 */
profileRouter.put('/update', jwtCheckAccessToken, profileController.updateProfileInformation, logger);

export default profileRouter;
