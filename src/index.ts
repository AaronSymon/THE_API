//Import Express
const express = require('express');
import { Request, Response } from 'express';
//Declare App
const app = express()
app.use(express.json())
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
app.use(compression())

//Import CookieParser
const cookieParser = require('cookie-parser');
app.use(cookieParser())

//import swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Import ExpressWinston and Winston
import * as expressWinston from 'express-winston'
import {format, transports} from "winston";
import {timerLoop} from "./tools/timerLoop";
import mountRouter from "./tools/router/mountRouters";

//Déclaration d'un Set pour stocker les tokens révoqués
export let revokedToken : Set<string> = new Set();
//Vider le set en fonction à intervalle régulier de la valeur définie dans le fichier .env
timerLoop(() =>{revokedToken.clear()}, Number(process.env.TL_TIMER));

app.use(expressWinston.logger({
    // Utiliser deux transports pour les journaux : console et fichier
    transports: [
        //new transports.Console(), // Transport de console commenté pour désactiver la journalisation de console
        new transports.File({
            filename: `logs/accessLogs/access.log`,
            maxsize: Number(process.env.LOG_LIMIT_SIZE),
            maxFiles: Number(process.env.LOG_LIMIT_FILES)
        }),
    ],
    // Format de chaque entrée de journal
    format: format.combine(
        format.timestamp(), // Ajouter une propriété timestamp pour chaque entrée de journal
        format.json(), // Formater chaque entrée de journal en tant qu'objet JSON
    )
}));

// Middleware pour logger les erreurs avec Winston
// Configuration du middleware de journalisation d'erreurs d'Express
app.use(expressWinston.errorLogger({
    // Utiliser deux transports pour les journaux d'erreurs : console et fichier
    transports: [
        //new transports.Console(), // Transport de console commenté pour désactiver la journalisation de console
        new transports.File({
            filename: `logs/errorLogs/error.log`,
            maxsize: Number(process.env.LOG_LIMIT_SIZE),
            maxFiles: Number(process.env.LOG_LIMIT_FILES)
        }),
    ],
    // Format de chaque entrée de journal d'erreur
    format: format.combine(
        format.timestamp(), // Ajouter une propriété timestamp pour chaque entrée de journal d'erreur
        format.json(), // Formater chaque entrée de journal d'erreur en tant qu'objet JSON
    )
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

//Use Routers
app.use('/api_access', api_accessRouter)
const routers = mountRouter()
routers.forEach((router) => {
    app.use(router.pathName, router.router)
});

//Print message on console when server is running
app.listen(process.env.SV_PORT, () => {
    console.log(`${process.env.APP_NAME}, using express is listening on port http://${process.env.SV_HOSTNAME}:${process.env.SV_PORT}/`)
    console.log(`Swagger documentation is available on http://${process.env.SV_HOSTNAME}:${process.env.SV_PORT}/api`)
})