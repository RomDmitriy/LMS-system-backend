import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';
import cors from 'cors';
import './shared/db-init.js';

// импортируем роуты
import authRouter from './routes/authRoutes.js';
import permissionRouter from './routes/permissionRoutes.js';

const app = express(); // инициализация express

const port = process.env.AUTH_PORT || 4800; // установка порта

app.use(cors()); // подключаем cors

app.use(express.json()); // для общения через JSON

// роуты
app.use('/auth', authRouter); // подключаем роут courses
app.use('/permission', permissionRouter); // подключаем роут permission

// документация
const options = {
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    },
    definition: {
        openapi: '3.0.0',
        info: {
            version: process.env.npm_package_version || '',
            title: 'LMS Auth',
            description: 'Документация для LMS - Auth сервиса',
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
                bearerAuthRefresh: {
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
    console.log('Auth server started! Port: ' + port);
});
