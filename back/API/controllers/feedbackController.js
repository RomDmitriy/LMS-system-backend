import Feedback from '../models/feedback.js';
import User from '../models/user.js';

export default class FeedbackController {
    async createFeedBackbyUser(req, res, next) {
        try {
            const { course_id } = req.params;
            const { description, mark } = req.body;

            // проверка оценки от 1 до 5
            if (parseInt(mark) < 1 || parseInt(mark) > 5) {
                res.status(400).end();
                next();
                return;
            }

            const date = new Date();
            const datetime = date.toDateString() + ' ' + date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();
            await Feedback.create({
                course_id,
                author_id: req.userId,
                description,
                mark,
                date: datetime,
            });
            res.status(201).end();
        } catch (err) {
            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        }

        next();
    }

    async getFeedBacksOfCourse(req, res, next) {
        try {
            const { course_id } = req.params;
            if (course_id === undefined || isNaN(parseInt(course_id))) {
                res.status(400).end();
                next();
                return;
            }

            let feedbackCourses = await Feedback.findAll({
                attributes: ['description', 'mark', 'date'],
                include: [{
                    model: User,
                    attributes: [
                        ['id', 'author_id'],
                        ['avatar_url', 'avatar_url'],
                    ],
                }],
                raw: true,
                where: {
                    course_id,
                },
            });

            if (feedbackCourses === null) {
                feedbackCourses = [];
            }

            for (let i = 0; i < feedbackCourses.length; i++) {
                feedbackCourses[i].author_id = feedbackCourses[i]['User.author_id'];
                feedbackCourses[i].avatar_url = feedbackCourses[i]['User.avatar_url'];
                delete feedbackCourses[i]['User.author_id'];
                delete feedbackCourses[i]['User.avatar_url'];
            }

            res.status(200).json(feedbackCourses);
        } catch (err) {
            if (err.code === '23503') {
                // если автор с таким id или курс с таким id не существуют
                res.status(400).end();
                next();
                return;
            }

            // если необработанная ошибка
            console.log(err);
            res.status(500).end();
        }

        next();
    }
}
