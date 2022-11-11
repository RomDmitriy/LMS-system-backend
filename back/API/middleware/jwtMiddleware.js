import jwt from 'jsonwebtoken';
import { logger } from '../middleware/logMiddleware.js';

export function jwtCheckAccessToken(req, res, next) {
    // проверка а послал ли клиент токен
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.status(401).end();
        logger(req, res);
        return;
    }

    try {
        // проверяем и получаем из него данные
        const info = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_KEY);
        if (info.type !== 'access') {
            throw Error('Token is not access');
        }

        req.userId = info.id;
        next();
    } catch (_) {
        // если токен истёк
        res.status(401).end();
        logger(req, res);
    }
}

export function jwtCheckAdditionalAccessToken(req, res, next) {
    // проверка а послал ли клиент токен
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        req.userId = null;
        next();
        return;
    }

    try {
        // проверяем и получаем из него данные
        const info = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_KEY);
        if (info.type !== 'access') {
            throw Error('Token is not access');
        }

        req.userId = info.id;
        next();
    } catch (_) {
        // если токен истёк
        res.status(401).end();
        logger(req, res);
    }
}

export function jwtCheckRefreshToken(req, res, next) {
    // проверка а послал ли клиент токен
    if (req.headers.authorization === undefined) {
        res.status(400).end();
        logger(req, res);
        return;
    }

    try {
        // проверяем и получаем из него данные
        const info = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_KEY);
        if (info.type !== 'refresh') {
            throw Error('Token is not refresh');
        }

        req.userId = info.id;
        next();
    } catch (_) {
        // если токен истёк
        res.status(401).end();
        logger(req, res);
    }
}
