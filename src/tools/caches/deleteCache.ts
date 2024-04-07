//Import Express
import {Request, Response} from 'express';
//Import TypeORM
import {ObjectLiteral} from "typeorm";
//Import Memory-Cache
import * as cache from 'memory-cache';

//Fonction qui supprime les données en chache pour une requête donnée
//Function that deletes the data in cache for a given request
/**
 * Delete the data in cache for a given request
 * @param req - Request
 * @param res - Response
 * @param dataBaseMethod - ObjectLiteral
 * @returns - Response
 */
export default async function deleteCache(req: Request, res: Response, dataBaseMethod: ObjectLiteral) {

    //Executer le code contenu dans le bloc try
    //To execute the code contained in the try block
    try {
        //Récupérer la clé de cache associée à la requête
        //Get the cache key associated with the request
        const cacheKey = req.url;

        //Suppirmer les données stockées pour cette clé en cache
        //Delete the stored data for this cache key
            cache.del(cacheKey);

        //Renvoyer les données depuis la base de données en utlisant la méthode passée en argument au client sous forme de réponse JSON
        //Send the data from the database using the method passed as an argument to the client as a JSON response
        return res.status(200).json(dataBaseMethod);

    //Si une erreur survient lors de l'exécution du code contenu dans le bloc try, renvoyer une erreur
    //If an error occurs while executing the code contained in the try block, return an error
    } catch (e) {
        // Si une erreur survient lors de la récupération des données depuis la base de données, on renvoie une erreur 500 au client avec un message d'erreur personnalisé
        // If an error occurs while retrieving the data from the database, we return a 500 error to the client with a custom error message
        return res.status(500).json({error: `erreur dans le traitement de ${dataBaseMethod}`});
    }

}