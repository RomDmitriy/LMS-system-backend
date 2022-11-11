import { Router } from 'express';
import FeedbackController from '../controllers/feedbackController.js';
import { jwtCheckAccessToken } from '../middleware/jwtMiddleware.js';
import { logger } from '../middleware/logMiddleware.js';

const feedbackRouter = Router();
const feedbackController = new FeedbackController();

/**
 * @swagger
 * /feedback/{course_id}:
 *  post:
 *    summary: Добавить отзыв к курсу.
 *    tags: [Feedback]
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
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - author_id
 *              - description
 *              - mark
 *            properties:
 *              description:
 *                type: string
 *                description: Текст отзыва.
 *              mark:
 *                type: integer
 *                enum:
 *                  - 1
 *                  - 2
 *                  - 3
 *                  - 4
 *                  - 5
 *                description: Оценка.
 *            example:
 *              description: Под пиво сойдёт.
 *              mark: 4
 *    responses:
 *      201:
 *        description: Отзыв к курсу успешно добавлен.
 *      500:
 *        description: Необработанная ошибка.
 */
feedbackRouter.post('/:course_id', jwtCheckAccessToken, feedbackController.createFeedBackbyUser, logger);

/**
 * @swagger
 * /feedback/{course_id}:
 *  get:
 *    summary: Получить массив отзывов к курсу.
 *    tags: [Feedback]
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
 *        description: Возвращает отзывы курса (даже если их нет).
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - author_id
 *                - avatar_url
 *                - decription
 *                - mark
 *                - date
 *              properties:
 *                author_id:
 *                  type: integer
 *                  description: ID автора комментария.
 *                avatar_url:
 *                  type: string
 *                  description: Ссылка на аватарку автора отзыва.
 *                description:
 *                  type: string
 *                  description: Текст отзыва.
 *                mark:
 *                  type: integer
 *                  enum:
 *                    - 1
 *                    - 2
 *                    - 3
 *                    - 4
 *                    - 5
 *                  description: Оценка.
 *            example: [{
 *              author_id: 1,
 *              avatar_url: "https://cdn.discordapp.com/attachments/753320814010433626/1000698840552308736/IMG_20220724_123943.jpg",
 *              description: "Под пиво сойдёт.",
 *              mark: 4,
 *              date: "2022-07-25T14:31:58.000Z"}]
 *      400:
 *        description: Некорректный ID курса или ID пользователя.
 *      500:
 *        description: Необработанная ошибка.
 */
feedbackRouter.get('/:course_id', feedbackController.getFeedBacksOfCourse, logger);

export default feedbackRouter;
