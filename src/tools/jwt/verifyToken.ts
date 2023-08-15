import e, { Request, Response } from 'express';
const jwt = require('jsonwebtoken');

// Import Dotenv
import * as process from 'process';

//Import Process
import * as dotenv from 'dotenv';
import {ipAdressOrUserAgentError} from "../../requestResponse/errors";
dotenv.config();


export default function verifyToken(req: Request, res: Response, next: Function) : e.Response<any, Record<string, any>> | void {
    const token = req.header('Authorization'); // Le token jwt doit être envoyé dans l'en-tête Authorization

    // Vérifiez si le token existe et est valide
    if (!token) {
        return res.status(401).json({ message: 'Token manquant. Accès refusé.' });
    }

    jwt.verify(token, process.env.TK_SECRETKEY, (err: Error, utilisateur: userPayload) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide ou expiré. Accès refusé.' });
        }

        // Vérifiez si l'adresse IP et l'agent utilisateur ne correspondent pas à ceux qui ont été utilisés pour générer le token
        if (utilisateur.ipAdress !== req.socket.remoteAddress || utilisateur.userAgent !== req.headers['user-agent']) {

            return res.status(ipAdressOrUserAgentError.status).json(ipAdressOrUserAgentError.message);

        }

        req['utilisateur'] = utilisateur; // Stockez l'utilisateur dans l'objet req avec la clé 'utilisateur'
        next(); // Passez au middleware ou à la logique de route suivante
    });
}