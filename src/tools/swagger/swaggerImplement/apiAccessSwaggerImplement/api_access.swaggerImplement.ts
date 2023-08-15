//Import express
import verifyToken from "../../../jwt/verifyToken";

const express = require('express');
import { Request, Response } from 'express';

//Import de l'entité User
import {User} from "../../../../entity/user.entity";
import {
    emailAlreadyUsedError,
    emailAndPasswordFormatError, emailFormatError,
    emailOrPasswordUndefinedError,
    passwordFormatError, userNotFoundByEmail
} from "../../../../requestResponse/errors";
import {validatePassword} from "../../../password/validatePassword";
import {emailRegex} from "../../../regex/regex";
import findUserByEmail from "../../../httpMethodToDataBase/apiAccess/findUserByEmail";
import {hashPassword} from "../../../password/hashPassword";
import insert from "../../../httpMethodToDataBase/insert";
import {comparePasswords} from "../../../password/comparePasswords";
import createToken from "../../../jwt/createToken";
import {revokedToken} from "../../../../index";


//Declare App
const app = express()

app.post('/api_access/signup', async (req: Request, res: Response) => {

    /*
        #swagger.description = "Endpoint to sign up."
        #swagger.responses[200] = {
            description: "Sign Up successfully",
        }
    */

    try {

        //Vérifier si l'email et le mot de passe saisis par l'utilisateur sont valides
        if (!req.body.email || !req.body.password) {

            return res.status(emailOrPasswordUndefinedError.status).json(emailOrPasswordUndefinedError.message);

        }
        //Sinon si l'email et le mot de passe ne sont pas valides
        else if (!await validatePassword(req.body.email) && !req.body.email.match(emailRegex)) {

            return res.status(emailAndPasswordFormatError.status).json(emailAndPasswordFormatError.message);

        }
        //Sinon si le mot de passe n'est pas valide
        else if (!await validatePassword(req.body.password)) {

            return res.status(passwordFormatError.status).json(passwordFormatError.message);

        }
        //Sinon si l'email n'est pas valide
        else if (!req.body.email.match(emailRegex)) {

            return res.status(emailFormatError.status).json(emailFormatError.message);

        }
        //Sinon si l'email et le mot de passe sont valides
        else {

            //Vérifier si l'email est déjà utilisé
            const isEmailExisting = await findUserByEmail(req.body.email);

            //Si l'email est déjà utilisé
            if (isEmailExisting) {

                return res.status(emailAlreadyUsedError.status).json(emailAlreadyUsedError.message);

            }

            //Définir une nouvelle instance de userToInsert
            const userToInsert = new User();

            //Définir les propriétés de l'instance de userToInsert
            userToInsert.email = req.body.email;
            userToInsert.password = await hashPassword(req.body.password)
            userToInsert.nom = req.body.nom
            userToInsert.prenom = req.body.prenom

            //Insérer l'instance de userToInsert dans la base de données
            await insert(User, userToInsert);

            return res.json({message: 'Account created successfully'});

        }

    } catch (e) {

        //console.log(e);
        res.status(500).json({message: 'Internal Server Error while creating account'});
    }

});

app.post('/api_access/login', async (req: Request, res: Response) => {

    /*
        #swagger.description = "Endpoint to login."
        #swagger.responses[200] = {
            description: "login successfully",
        }
    */

    try {

        //Vérifier si l'email existe en base de données
        const isUserExisting = await findUserByEmail(req.body.email);

        //Si l'email n'existe pas en base de données
        if (!isUserExisting) {

            return res.status(userNotFoundByEmail.status).json(userNotFoundByEmail.message);
        }

        //Sinon si l'email existe en base de données, comparer le mot de passe saisi par l'utilisateur avec le mot de passe en base de données

        switch (await comparePasswords(req.body.password, isUserExisting.password)) {

            case true:

                //Créer un token d'authentification pour accéder aux différentes routes de l'API auxquels l'utilsateur a accès
                const accessToken = createToken({id: isUserExisting.id, email: isUserExisting.email, role: isUserExisting.role, userAgent: req.headers['user-agent'], ipAdress: req.socket.remoteAddress});

                // assigning accessToken in http-only cookie
                res.cookie('accessToken', accessToken,{ httpOnly: true,
                    sameSite: 'lax',
                    secure: false,//Mettre cette valeur à true pour n'autoriser l'envoie que si l'on est dans https
                    maxAge: 24 * 60 * 60 * 1000
                })

                //return res.status(200).json({token : accessToken})

                return res.json({message: 'Login successfully'});

            case false:

                return res.status(401).json({message: 'Invalid email or password'});

        }

    } catch (e) {

        //console.log(e);
        res.status(500).json({message: 'Internal Server Error while logging in'});
    }

});

app.post('/api_access/logout', verifyToken, async (req: Request, res: Response) => {

    /*
        #swagger.description = "Endpoint to logout."
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.responses[200] = {
            description: "logout successfully",
        }
    */

    try {

        //Extraire le token de l'utilisateur du header de la requête
        const userAccessToken = req.headers.authorization;

        //Vérifier si le token de l'utilisateur est dans la liste des tokens révoqués
        if (revokedToken.has(userAccessToken)) {

            return res.status(403).json({ message: 'Token invalide ou expiré. Accès refusé.' });

        }

        //Ajouter le token de l'utilisateur dans la liste des tokens révoqués
        revokedToken.add(userAccessToken);

        //Supprimer le cookie contenant le token de l'utilisateur
        res.clearCookie('accessToken');

        //Retourner un message de succès
        return res.status(200).json({ message: 'Logout successfully' });

    } catch (e) {

        //console.log(e);
        res.status(500).json({message: 'Internal Server Error while logging out'});
    }

});