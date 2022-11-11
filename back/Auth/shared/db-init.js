import { Sequelize } from 'sequelize';

import initModels from '../models/init-models.js';

// раскоментировать при запуске не через docker-compose
// import '../loadENV.js';

// инициализация соединения с БД
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_IP,
    dialect: 'postgres',
    logging: false,
});

// объявление моделей
initModels(db);

export default db;
