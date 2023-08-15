import e, { Request, Response } from 'express';
import {error403} from "../../requestResponse/errors";
import isObjectNotEmpty from "../object/isObjectNotEmpty";
import arrayIncludedInOtherArray from "../arrays/arrayIncludedInOtherArray";

export default function verifyUserAccessByRole(req: Request, res: Response,next: Function, entityAccesses: Set<entityAccess>): e.Response<any, Record<string, any>> | void{

    try {

        //déclarer une variable qui contient l'access de l'utilisateur à la ressource demandée si celle-ci existe
        const isUserHaveAccess = [...entityAccesses].find( access => access.userRole === req['utilisateur'].role && access.accessMethods.has(req.method));

        //Si l'utilisateur a accès à la ressource demandée
        if (isUserHaveAccess) {


            switch (req.method === 'GET') {

                // Si la requête est de type GET
                case true:

                    //Si la requête possède des paramètres
                    if (isObjectNotEmpty(req.params)) {

                        //Si l'utilisateur possède des accès à des routes comportant des paramètres
                        if (isObjectNotEmpty(isUserHaveAccess.getAccessParams)) {

                            //Récupérer les paramètres de la requête dans un tableau
                            const requestParams = Object.keys(req.params);

                            //Vérifier si tous les paramètres de la requête sont incuts dans le tableau des paramètres de l'utilisateur
                            if (arrayIncludedInOtherArray(requestParams, isUserHaveAccess.getAccessParams)) {

                                //Si oui, exécuter la requête "next"
                                next();

                            } else {

                                //Si non, retourner une erreur 403
                                return res.status(error403.status).json(error403.message);
                            }
                        } else {

                            //Si l'utilisateur ne possède pas tout les accès aux différents paramètres de la requête, renvoyer une erreur 403
                            return res.status(error403.status).json(error403.message);
                        }

                    } else {

                        //Si elle ne possède pas de paramètres, exécuter la requête "next"
                        next();
                    }

                    break;

                //Dans le cas d'une requête POST, PUT ou DELETE, exécuter la requête "next"
                case false:
                    next();
                    break;
            }

        } else {
            //Si l'utilisateur n'a pas accès à la ressource demandée, retourner une erreur 403
            return res.status(error403.status).json(error403.message);
        }

    } catch (e) {
        //console.log(e)
    }



}

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