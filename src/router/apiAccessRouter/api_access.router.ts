//Import Express
import verifyToken from "../../tools/jwt/verifyToken";

const express = require('express');
import { Request, Response } from 'express';

//Import de l'entité User
import {User} from "../../entity/user.entity";

//Import Password
import {validatePassword} from "../../tools/password/validatePassword";
import {hashPassword} from "../../tools/password/hashPassword";
import {comparePasswords} from "../../tools/password/comparePasswords";

//Import Regex
import {emailRegex} from "../../tools/regex/regex";

//Import dataBase Method
import insert from "../../tools/httpMethodToDataBase/insert";
import findUserByEmail from "../../tools/httpMethodToDataBase/apiAccess/findUserByEmail";

//Import JWT
import createToken from "../../tools/jwt/createToken";
import {revokedToken} from "../../index";


//Déclaration du router
export const api_accessRouter = express.Router();

//Définition des routes
//Define routes

//Route pour créer un compte utilisateur
//Route to create a user account
api_accessRouter.post('/signup', async (req: Request, res: Response) => {

    //Exécuter le code contenue dans le bloc try
    //Execute the code contained in the try block
    try {

        //Vérifier si l'email et le mot de passe saisis par l'utilisateur sont valides
        //Si l'email ou le mot de passe saisis par l'utilisateur ne sont pas valides
        //Check if the email and password entered by the user are valid
        //If the email or password entered by the user are not valid
        if (!req.body.email || !req.body.password) {

            return res.status(400).json({message: 'Email and password required !'});

        }
        //Sinon si l'email et le mot de passe ne sont pas valides
        //Else if the email and password are not valid
        else if (!await validatePassword(req.body.email) && !req.body.email.match(emailRegex)) {

            //Retourner une erreur
            //Return an error
            return res.status(400).json({message: 'Email and password format must be valid'});

        }
        //Sinon si le mot de passe n'est pas valide
        //Else if the password is not valid
        else if (!await validatePassword(req.body.password)) {

            //Retourner une erreur
            //Return an error
            return res.status(400).json({message: 'Password format must be valid'});

        }
        //Sinon si l'email n'est pas valide
        //Else if the email is not valid
        else if (!req.body.email.match(emailRegex)) {

            //Retourner une erreur
            //Return an error
            return res.status(400).json({message: 'Email format must be valid'});

        }
        //Sinon si l'email et le mot de passe sont valides
        //Else if the email and password are valid
        else {

            //Vérifier si l'email est déjà utilisé
            //Check if the email is already used
            const isEmailExisting = await findUserByEmail(req.body.email);

            //Si l'email est déjà utilisé
            //If the email is already used
            if (isEmailExisting) {

                //Retourner une erreur
                //Return an error
                return res.status(409).json({message: 'Email already used'});

            }

            //Définir une nouvelle instance de userToInsert
            //Define a new instance of userToInsert
            const userToInsert = new User();

            //Définir les propriétés de l'instance de userToInsert
            //Define the properties of the instance of userToInsert
            userToInsert.email = req.body.email;
            userToInsert.password = await hashPassword(req.body.password)
            userToInsert.nom = req.body.nom
            userToInsert.prenom = req.body.prenom

            //Insérer l'instance de userToInsert dans la base de données
            //Insert the instance of userToInsert in the database
            await insert(User, userToInsert);

            //Retourner un message de succès
            //Return a success message
            return res.json({message: 'Account created successfully'});

        }
    //Si une erreur est survenue dans le bloc try, exécuter le code contenue dans le bloc catch
    //If an error occurred in the try block, execute the code contained in the catch block
    }catch (e) {

        //Retourner une erreur
        //Return an error
        //console.log(e);
        return res.status(500).json({message: 'Internal Server Error while creating account'});
    }

});

//Route pour se connecter à un compte utilisateur
//Route to connect to a user account
api_accessRouter.post('/login', async (req: Request, res: Response) => {

    //Exécuter le code contenue dans le bloc try
    //Execute the code contained in the try block
    try {

        //Vérifier si l'email existe en base de données
        //Si l'email n'existe pas en base de données
        const isUserExisting = await findUserByEmail(req.body.email);

        //Si l'email n'existe pas en base de données
        //If the email does not exist in the database
        if (!isUserExisting) {

            //Retourner une erreur
            //Return an error
            return res.status(404).json({message: 'Invalid email or password'});
        }

        //Sinon si l'email existe en base de données, comparer le mot de passe saisi par l'utilisateur avec le mot de passe en base de données
        //Else if the email exists in the database, compare the password entered by the user with the password in the database
        switch (await comparePasswords(req.body.password, isUserExisting.password)) {

            //Si le mot de passe saisi par l'utilisateur correspond au mot de passe en base de données
            //If the password entered by the user matches the password in the database
            case true:

                //Créer un token d'authentification pour accéder aux différentes routes de l'API auxquels l'utilsateur a accès
                //Create an authentication token to access the different routes of the API to which the user has access
                const accessToken = createToken({id: isUserExisting.id, email: isUserExisting.email, role: isUserExisting.role, userAgent: req.headers['user-agent'], ipAdress: req.socket.remoteAddress});

                //Assigné le token d'authentification dans un cookie http-only
                //Assigning accessToken in http-only cookie
                res.cookie('accessToken', accessToken,{ httpOnly: true,
                    sameSite: 'lax', //Todo replacer la valeur à 'None' avant mise en production pour https,
                    secure: false,//Mettre cette valeur à true pour n'autoriser l'envoie que si l'on est dans https
                    maxAge: 24 * 60 * 60 * 1000
                })

                //return res.status(200).json({token : accessToken})

                //Retourner un message de succès
                //Return a success message
                return res.status(200).json({message: 'Login successfully'});

            //Si le mot de passe saisi par l'utilisateur ne correspond pas au mot de passe en base de données
            //If the password entered by the user does not match the password in the database
            case false:

                //Retourner une erreur
                //Return an error
                return res.status(401).json({message: 'Invalid email or password'});

        }

    //Si une erreur est survenue dans le bloc try, exécuter le code contenue dans le bloc catch
    //If an error occurred in the try block, execute the code contained in the catch block
    } catch (e) {

        //Retourner une erreur
        //Return an error
        //console.log(e);
        return res.status(500).json({message: 'Internal Server Error while logging in'});
    }

});

//Route pour se déconnecter d'un compte utilisateur
//Route to disconnect from a user account
api_accessRouter.post('/logout',verifyToken, (req: Request, res: Response) => {

    try {

        //Extraire le token de l'utilisateur du header de la requête
        //Extract the user's token from the request header
        const userAccessToken = req.headers.authorization;

        //Vérifier si le token de l'utilisateur est dans la liste des tokens révoqués
        //Check if the user's token is in the list of revoked tokens
        if (revokedToken.has(userAccessToken)) {

            //Si le token de l'utilisateur est dans la liste des tokens révoqués, retourner un message d'erreur
            //If the user's token is in the list of revoked tokens, return an error message
            return res.status(403).json({ message: 'Permission denied' });

        }

        //Ajouter le token de l'utilisateur dans la liste des tokens révoqués
        //Add the user's token to the list of revoked tokens
        revokedToken.add(userAccessToken);

        //Supprimer le cookie contenant le token de l'utilisateur
        //Delete the cookie containing the user's token
        res.clearCookie('accessToken');

        //Retourner un message de succès
        //Return a success message
        return res.status(200).json({ message: 'Logout successfully' });

    //Si une erreur est survenue dans le bloc try, exécuter le code contenue dans le bloc catch
    //If an error occurred in the try block, execute the code contained in the catch block
    } catch (e) {

        //Retourner une erreur
        //Return an error
        //console.log(e);
        return res.status(500).json({message: 'Internal Server Error while logging out'});
    }

});

//Route pour rafraîchir le token d'authentification
//Route to refresh the authentication token
api_accessRouter.post('/refreshToken', (req: Request, res: Response) => {

        return res.json({ message: 'RefreshToken' });

});