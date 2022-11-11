import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import AWS from 'aws-sdk';
import { faker } from '@faker-js/faker';
import path from 'path';

// раскоментировать при запуске не через docker-compose
// import './loadENV.js';

const PORT = process.env.UPLOADER_PORT;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_S3_ENDPOINT,
    region: process.env.AWS_S3_REGION,
});

const app = express();

app.use(cors());

app.use(fileUpload());

app.post('/upload', async (req, res) => {
    // TODO: добавить проверку, что чел с access token может менять курс

    // если файл не приложен
    if (!req.files || req.files.file === undefined || req.files.course_id) {
        return res.status(400).send('Файл не загружен.');
    }

    // проверка на нормальность course_id
    if (isNaN(req.body.course_id)) {
        res.status(400).end();
        return;
    }

    // проверка формата файла
    // let format = 'hz';
    // switch (req.files.file.mimetype) {
    //     case "image/png": {
    //         format = 'png';
    //         break;
    //     }
    //     case "image/jpg": {
    //         format = 'jpg';
    //         break;
    //     }
    //     case "image/jpeg": {
    //         format = 'jpeg';
    //         break;
    //     }
    //     default: {
    //         res.status(415).end();
    //         return;
    //     }
    // }

    const result = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: 'courses/' + req.body.course_id + '/' + faker.datatype.uuid() + '.' + (new Date().getTime()) + path.extname(req.files.file.name),
        Body: req.files.file.data,
    }, undefined, err => {
        console.log(err);
    }).promise();

    res.status(201).json({ link: result.Location });

    // console.log(result);
});

app.listen(PORT, () => {
    console.log(`Uploader started!    Port: ${PORT}`);
});
