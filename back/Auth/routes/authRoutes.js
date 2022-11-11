import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { jwtCheckRefreshToken } from '../middleware/jwtMiddleware.js';
import { logger } from '../middleware/logMiddleware.js';

const authRouter = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: Зарегистрировать пользователя
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - first_name
 *              - second_name
 *              - third_name
 *              - password
 *              - is_mentor
 *            properties:
 *              email:
 *                type: string
 *                description: Email пользователя. Стоит проверка на email-формат. Максимум 320 символов.
 *              first_name:
 *                type: string
 *                description: Имя пользователя.
 *              second_name:
 *                type: string
 *                description: Фамилия пользователя.
 *              third_name:
 *                type: string
 *                description: Отчество пользователя.
 *              password:
 *                type: string
 *                description: Пароль пользователя. Минимум 8 символов. Максимум 64 символа.
 *              is_mentor:
 *                type: boolean
 *                description: Хочет ли он быть ментором.
 *            example:
 *              email: ivanov@mail.ru
 *              first_name: Иван
 *              second_name: Иванов
 *              third_name: Иванович
 *              password: "12345678"
 *              is_mentor: false
 *    responses:
 *      201:
 *        description: Пользователь успешно добавлен.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - access_token
 *                - refresh_token
 *              properties:
 *                access_token:
 *                  type: string
 *                  description: Access-токен. Используется для запросов, требующих идентификации пользователя и его прав.
 *                refresh_token:
 *                  type: string
 *                  description: Refresh-токен. Используется для запроса обновления токенов.
 *              example:
 *                access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NTgzMTEyMTl9.PfaWxcTkxS2Nb-PS4JxqlfEEEmth9jr8BtisVueo2Uo
 *                refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NjA5MDIzMTl9.4I9DfB3kfSgP-slM-MEgSmqHYu6QyIRyc3Ebxn9Bhcc
 *      400:
 *        description: Неправильные параметры в теле запроса.
 *      409:
 *        description: Email уже занят.
 *      500:
 *        description: Необработанная ошибка.
 */
authRouter.post('/register', authController.createUser, logger); // регистрация

/**
 * @swagger
 * /auth/login:
 *  get:
 *    summary: Вход в аккаунт пользователя
 *    tags: [Auth]
 *    deprecated: true
 *    parameters:
 *      - in: query
 *        name: email
 *        schema:
 *          type: string
 *        required: true
 *        description: Email пользователя.
 *        default: ivanov@mail.ru
 *      - in: query
 *        name: password
 *        schema:
 *          type: string
 *        required: true
 *        description: Пароль пользователя.
 *        default: 12345678
 *    responses:
 *      200:
 *        description: Пользователь аутентифицирован.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - access_token
 *                - refresh_token
 *                - is_mentor
 *              properties:
 *                access_token:
 *                  type: string
 *                  description: Access-токен. Используется для запросов, требующих идентификации пользователя и его прав.
 *                refresh_token:
 *                  type: string
 *                  description: Refresh-токен. Используется для запроса обновления токенов.
 *                is_mentor:
 *                  type: boolean
 *                  description: Ментор ли пользователь.
 *              example:
 *                access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NTgzMTEyMTl9.PfaWxcTkxS2Nb-PS4JxqlfEEEmth9jr8BtisVueo2Uo
 *                refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NjA5MDIzMTl9.4I9DfB3kfSgP-slM-MEgSmqHYu6QyIRyc3Ebxn9Bhcc
 *                is_mentor: true
 *      401:
 *        description: Неверный пароль.
 *      404:
 *        description: Пользователь с таким email не найден.
 *      500:
 *        description: Необработанная ошибка.
 */
authRouter.get('/login', authController.userAuthentication, logger); // аутентификация

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Вход в аккаунт пользователя
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                description: Email пользователя. Стоит проверка на email-формат. Максимум 320 символов.
 *              password:
 *                type: string
 *                description: Пароль пользователя. Минимум 8 символов. Максимум 64 символа.
 *            example:
 *              email: ivanov@mail.ru
 *              password: "12345678"
 *    responses:
 *      200:
 *        description: Пользователь аутентифицирован.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - access_token
 *                - refresh_token
 *                - is_mentor
 *              properties:
 *                access_token:
 *                  type: string
 *                  description: Access-токен. Используется для запросов, требующих идентификации пользователя и его прав.
 *                refresh_token:
 *                  type: string
 *                  description: Refresh-токен. Используется для запроса обновления токенов.
 *                is_mentor:
 *                  type: boolean
 *                  description: Ментор ли пользователь.
 *              example:
 *                access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NTgzMTEyMTl9.PfaWxcTkxS2Nb-PS4JxqlfEEEmth9jr8BtisVueo2Uo
 *                refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NjA5MDIzMTl9.4I9DfB3kfSgP-slM-MEgSmqHYu6QyIRyc3Ebxn9Bhcc
 *                is_mentor: true
 *      401:
 *        description: Неверный пароль.
 *      404:
 *        description: Пользователь с таким email не найден.
 *      500:
 *        description: Необработанная ошибка.
 */
authRouter.post('/login', authController.userAuthenticationPost, logger); // аутентификация

/**
 * @swagger
 * /auth/refresh:
 *  put:
 *    summary: Обновить токены.
 *    tags: [Auth]
 *    security:
 *      - bearerAuthRefresh: []
 *    responses:
 *      200:
 *        description: Токены обновлены.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - access_token
 *                - refresh_token
 *              properties:
 *                access_token:
 *                  type: string
 *                  description: Access-токен. Используется для запросов, требующих идентификации пользователя и его прав.
 *                refresh_token:
 *                  type: string
 *                  description: Refresh-токен. Используется для запроса обновления токенов.
 *              example:
 *                access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NTgzMTEyMTl9.PfaWxcTkxS2Nb-PS4JxqlfEEEmth9jr8BtisVueo2Uo
 *                refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjU4MzEwMzE5LCJleHAiOjE2NjA5MDIzMTl9.4I9DfB3kfSgP-slM-MEgSmqHYu6QyIRyc3Ebxn9Bhcc
 *      400:
 *        description: Токен отсутствует.
 *      401:
 *        description: Refresh токен недействителен.
 *      500:
 *        description: Необработанная ошибка.
 */

authRouter.put('/refresh', jwtCheckRefreshToken, authController.updateTokens, logger); // обновление Access Token

/**
 * @swagger
 * /auth/logout:
 *  put:
 *    summary: Выйти из аккаунта (сделать refresh token недействительным)
 *    tags: [Auth]
 *    security:
 *      - bearerAuthRefresh: []
 *    responses:
 *      200:
 *        description: Успешный выход.
 *      400:
 *        description: Токен отсутствует.
 *      401:
 *        description: Refresh токен уже недействителен.
 *      500:
 *        description: Необработанная ошибка.
 */
authRouter.put('/logout', jwtCheckRefreshToken, authController.logout);

export default authRouter;
