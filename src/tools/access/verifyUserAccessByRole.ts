import e, { Request, Response } from 'express';
import isObjectNotEmpty from "../object/isObjectNotEmpty";
import arrayIncludedInOtherArray from "../arrays/arrayIncludedInOtherArray";
import {entityAccess} from "../../types";

export default function verifyUserAccessByRole(req: Request, res: Response,next: Function, entityAccesses: Set<entityAccess>): e.Response<any, Record<string, any>> | void{

    //Exécuter le code contenu dans le bloc try
    //Execute the code contained in the try block
    try {
        //déclarer une variable qui contient l'access de l'utilisateur à la ressource demandée si celle-ci existe
        //declare a variable that contains the user's access to the requested resource if it exists
        const isUserHaveAccess = [...entityAccesses].find( access => access.userRole === req['utilisateur'].role && access.accessMethods.has(req.method));

        //Si l'utilisateur a accès à la ressource demandée
        //If the user has access to the requested resource
        if (isUserHaveAccess) {
            //Vérifier le type de la requête
            //Check the type of the request
            switch (req.method === 'GET') {
                // Si la requête est de type GET
                // If the request is of type GET
                case true:
                    //Si la requête possède des paramètres
                    //If the request has parameters
                    if (isObjectNotEmpty(req.params)) {
                        //Si l'utilisateur possède des accès à des routes comportant des paramètres
                        //If the user has access to routes with parameters
                        if (isObjectNotEmpty(isUserHaveAccess.getAccessParams)) {
                            //Récupérer les paramètres de la requête dans un tableau
                            //Get the request parameters in an array
                            const requestParams = Object.keys(req.params);
                            //Vérifier si tous les paramètres de la requête sont incuts dans le tableau des paramètres de l'utilisateur
                            //Check if all request parameters are included in the user's parameters array
                            if (arrayIncludedInOtherArray(requestParams, isUserHaveAccess.getAccessParams)) {
                                //Si oui, exécuter la requête "next"
                                //If yes, execute the "next" request
                                next();
                            } else {
                                //Si non, retourner une erreur 403
                                //If not, return an error 403
                                return res.status(403).json({message: 'Access denied.'});
                            }
                        } else {
                            //Si l'utilisateur ne possède pas tout les accès aux différents paramètres de la requête, renvoyer une erreur 403
                            //If the user does not have all the accesses to the different parameters of the request, return an error 403
                            return res.status(403).json({message: 'Access denied.'});
                        }
                    } else {

                        //Si elle ne possède pas de paramètres, exécuter la requête "next"
                        //If it does not have parameters, execute the "next" request
                        next();
                    }
                    break;
                //Dans le cas d'une requête POST, PUT ou DELETE, exécuter la requête "next"
                //In the case of a POST, PUT or DELETE request, execute the "next" request
                case false:
                    next();
                    break;
            }
        } else {
            //Si l'utilisateur n'a pas accès à la ressource demandée, retourner une erreur 403
            //If the user does not have access to the requested resource, return an error 403
            return res.status(403).json({message: 'access denied.'});
        }
    //Si une erreur est survenue, l'afficher dans la console
    //If an error occurred, display it in the console
    } catch (e) {
        //console.log(e)
    }
}

//Fonction middleware qui vérifie prenant en paramètre un set entityAccess pour détemriner si un utilisateur à accès à une ressource demandée
//Middleware function that takes a set entityAccess as a parameter to determine if a user has access to a requested resource
export const verifyUserAccessMiddleware = (entityAccess: Set<entityAccess>) => {
    return (req: Request, res: Response, next: Function) => {
        verifyUserAccessByRole(req, res, next, entityAccess);
    }
}




//Vérifier si l'utilisateur a accès à l'entité demandée
//if (req.params.id) {
//    if (req['utilisateur'].id !== req.params.id) {
//        return res.status(403).json({message: 'access Forbidden'});
//    }
//}