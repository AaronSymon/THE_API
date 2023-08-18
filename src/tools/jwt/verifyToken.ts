//Import Express
import e, { Request, Response } from 'express';

//Impoort Jwt
const jwt = require('jsonwebtoken');

// Import Dotenv
import * as process from 'process';

//Import Process
import * as dotenv from 'dotenv';

dotenv.config();

//Fonction verifyToken, vérifie si le token est valide
//Function verifyToken, check if the token is valid
export default function verifyToken(req: Request, res: Response, next: Function) : e.Response<any, Record<string, any>> | void {

    // Récupérez le token jwt
    // Get the jwt token
    const token = req.header('Authorization'); // Le token jwt doit être envoyé dans l'en-tête Authorization

    // Vérifiez si le token existe et est valide
    // Check if token exist and is valid
    if (!token) {

        // Si le token n'existe pas, renvoyez une réponse 401 (non autorisée)
        // If token doesn't exist, send a 401 response (unauthorized)
        return res.status(401).json({ message: 'Token is required. Access denied.' });
    }

    // Vérifiez si le token est valide
    // Check if token is valid
    jwt.verify(token, process.env.TK_SECRETKEY, (err: Error, utilisateur: userPayload) => {

        // Si le token n'est pas valide, renvoyez une réponse 403 (interdite)
        // If token is not valid, send a 403 response (forbidden)
        if (err) {
            return res.status(403).json({ message: 'Invalid token. Access denied.' });
        }

        // Vérifiez si l'adresse IP et l'agent utilisateur ne correspondent pas à ceux qui ont été utilisés pour générer le token
        // Check if ip adress and user agent don't match with the ones used to generate the token
        if (utilisateur.ipAdress !== req.socket.remoteAddress || utilisateur.userAgent !== req.headers['user-agent']) {

            // Si l'adresse IP et l'agent utilisateur ne correspondent pas à ceux qui ont été utilisés pour générer le token, renvoyez une réponse 403 (interdite)
            // If ip adress and user agent don't match with the ones used to generate the token, send a 403 response (forbidden)
            return res.status(403).json({message: 'Invalid token. Access denied.'});

        }

        // Stockez l'utilisateur dans l'objet req avec la clé 'utilisateur'
        // Store the user in the req object with the key 'utilisateur'
        req['utilisateur'] = utilisateur;

        // Passez au middleware ou à la logique de route suivante
        // Go to the next middleware or next route logic
        next();
    });
}