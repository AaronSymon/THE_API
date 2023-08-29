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

//Déclaration du Set revokedToken pour stocker les tokens révoqués
//Declare revokedToken Set to store revoked tokens
export let revokedToken : Set<string> = new Set();

//Vider le set à intervalle régulier de la valeur définie dans le fichier .env
//Clear the set at regular intervals based on the value defined in the .env file
timerLoop(() =>{revokedToken.clear()}, Number(process.env.TL_TIMER));

app.use(expressWinston.logger({
    // Utiliser deux transports pour les journaux : console et fichier
    // Use two transports for logs: console and file
    transports: [
        //new transports.Console(), // Transport de console commenté pour désactiver la journalisation de console
                                    //Console transport commented to disable console logging
        new transports.File({
            filename: `logs/accessLogs/access.log`,
            maxsize: Number(process.env.LOG_LIMIT_SIZE),
            maxFiles: Number(process.env.LOG_LIMIT_FILES)
        }),
    ],
    // Format de chaque entrée de journal
    // Format of each log entry
    format: format.combine(
        format.timestamp(), // Ajouter une propriété timestamp pour chaque entrée de journal
                            // Add a timestamp property for each log entry
        format.json(), // Formater chaque entrée de journal en tant qu'objet JSON
                       // Format each log entry as a JSON object
    )
}));

// Middleware pour logger les erreurs avec Winston
// Middleware to log errors with Winston
// Configuration du middleware de journalisation d'erreurs d'Express
// Configuration of the Express error logging middleware
app.use(expressWinston.errorLogger({
    // Utiliser deux transports pour les journaux d'erreurs : console et fichier
    // Use two transports for error logs: console and file
    transports: [
        //new transports.Console(), // Transport de console commenté pour désactiver la journalisation de console
                                    //Console transport commented to disable console logging
        new transports.File({
            filename: `logs/errorLogs/error.log`,
            maxsize: Number(process.env.LOG_LIMIT_SIZE),
            maxFiles: Number(process.env.LOG_LIMIT_FILES)
        }),
    ],
    // Format de chaque entrée de journal d'erreur
    // Format of each error log entry
    format: format.combine(
        format.timestamp(), // Ajouter une propriété timestamp pour chaque entrée de journal d'erreur
                            // Add a timestamp property for each error log entry
        format.json(), // Formater chaque entrée de journal d'erreur en tant qu'objet JSON
                        // Format each error log entry as a JSON object
    )
}));

app.get('/', async (req: Request, res: Response) => {

    res.send('Hello World!')

})



//Declaration des routers
//Declaration of routers
app.use('/api_access', api_accessRouter)
const routers = mountRouter()
routers.forEach((router) => {
    app.use(router.pathName, router.router)
});

//Afficher un message sur la console lorsque le serveur est en cours d'exécution
//Print message on console when server is running
app.listen(process.env.SV_PORT, () => {
    console.log(`${process.env.APP_NAME}, using express is listening on port http://${process.env.SV_HOSTNAME}:${process.env.SV_PORT}/`)
    console.log(`Swagger documentation is available on http://${process.env.SV_HOSTNAME}:${process.env.SV_PORT}/api`)
})
