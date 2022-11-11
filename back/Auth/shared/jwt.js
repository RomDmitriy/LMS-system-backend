import jwt from 'jsonwebtoken';

// генерация access_token и refresh_token
export function generateTokens(id) {
    return {
        access_token: jwt.sign(
            { id, type: 'access' },
            process.env.JWT_KEY,
            { expiresIn: 900 },
        ), // 15 минут
        refresh_token: jwt.sign(
            { id, type: 'refresh' },
            process.env.JWT_KEY,
            { expiresIn: 2592000 },
        ), // 30 дней
    };
}

export function generateEmailVerifyToken(id) {
    const today = new Date();

    today.setHours(today.getHours() + 1);

    return jwt.sign(
        {
            id,
            expirationTime: today.toISOString().replace(/\.\w*/, '').replace('T', ' '),
        },
        process.env.JWT_KEY,
        { expiresIn: 3600 },
    );
}
