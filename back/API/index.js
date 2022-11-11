import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';
import cors from 'cors';
import './shared/db-init.js';

// импортируем роуты
import coursesRouter from './routes/courseRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import profileRouter from './routes/profileRoutes.js';

const app = express(); // инициализация express

const port = process.env.API_PORT || 5000; // установка порта

app.use(cors()); // подключаем cors

app.use(express.json()); // для общения через JSON

// роуты
app.use('/course', coursesRouter); // подключаем роут courses
app.use('/feedback', feedbackRouter); // подключаем роут feedback
app.use('/admin', adminRouter); // подключаем роут admin
app.use('/profile', profileRouter); // подключаем роут profile

// документация
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            version: '2.0.0',
            title: 'LMS API',
            description: 'Документация для LMS - API сервиса',
        },
        servers: [
            {
                url: `http://${process.env.DB_EXTERNAL_IP}:${port}`,
                description: 'Production сервер',
            },
            {
                url: `http://localhost:${port}`,
                description: 'Develop сервер',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                bearerAdditionalAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
    console.log('API server started!  Port: ' + port);
});
