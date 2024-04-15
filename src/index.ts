//Import Express
const express = require('express');
import { Request, Response } from 'express';
//Declare App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Import api_accessRouter
import {api_accessRouter} from "./router/apiAccessRouter/api_access.router";

// Import Dotenv
import * as process from 'process';

//Import Process
import * as dotenv from 'dotenv';
dotenv.config();

//Import Cors
import * as cors from "cors";
app.use(cors({ origin: "http://localhost:3000", preflightContinue: true ,credentials: true }));

//Import Compression
const compression = require('compression');
app.use(compression());

//Import CookieParser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//import swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Import ExpressWinston and Winston
const winston = require('winston');
const expressWinston = require('express-winston');

import {timerLoop} from "./tools/timerLoop";
import mountRouter from "./tools/router/mountRouters";

//Déclaration du Set revokedToken pour stocker les tokens révoqués
//Declare revokedToken Set to store revoked tokens
export let revokedToken : Set<string> = new Set();

//Vider le set revokedToken à intervalle régulier de la valeur définie dans le fichier .env
//Clear the revokedToken set at regular intervals of the value defined in the .env file
timerLoop(() =>{revokedToken.clear()}, Number(process.env.TL_TIMER));

//Configuration de Winston pour journaliser les logs dans un fichier
//Configuration of Winston to log logs in a file
//Todo : Voir comment automatiser les logs lors de l'exécution des requêtes https (ex: /login, ajouter log 'Nom de l'utilisateur' s'est connecté avec succès) en utilisant la constante logger
const logger = winston.createLogger({
    transports : [
        new winston.transports.File({
            filename: `logs/conbinedLogs/combined.log`,
            maxsize: Number(process.env.LOG_LIMIT_SIZE),
            maxFiles: Number(process.env.LOG_LIMIT_FILES)
        })
    ]
});

//Middleware pour logger les requêtes HTTP avec Winston
//Middleware to log HTTP requests with Winston
app.use(expressWinston.logger({
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({
            filename: `logs/httpLogs/http.log`,
            maxsize: Number(process.env.LOG_LIMIT_SIZE),
            maxFiles: Number(process.env.LOG_LIMIT_FILES)
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
}));

//Middleware pour logger les erreurs avec Winston
//Middleware to log errors with Winston
app.use(expressWinston.errorLogger({
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({
            filename: `logs/errorLogs/error.log`,
            maxsize: Number(process.env.LOG_LIMIT_SIZE),
            maxFiles: Number(process.env.LOG_LIMIT_FILES)
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.json()
    ),
}));

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World!');
});

//Declaration des routers
//Declaration of routers
app.use('/api_access', api_accessRouter);
const routers = mountRouter();
routers.forEach((router) => {
    app.use(router.pathName, router.router);
});

//Afficher un message sur la console lorsque le serveur est en cours d'exécution
//Print message on console when server is running
app.listen(process.env.SV_PORT, () => {
    console.log(`${process.env.APP_NAME}, using express is listening on port http://${process.env.SV_HOSTNAME}:${process.env.SV_PORT}/`)
    console.log(`Swagger documentation is available on http://${process.env.SV_HOSTNAME}:${process.env.SV_PORT}/api`)
});
