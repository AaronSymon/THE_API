import {Request, Response} from 'express';
import {ObjectLiteral} from "typeorm";
import * as cache from 'memory-cache';

export default async function deleteCache(req: Request, res: Response, dataBaseMethod: ObjectLiteral) {

    // On récupère la clé de cache associée à la requête
    const cacheKey = req.url;

    // On supprime les données stockées pour cette clé en cache
        cache.del(cacheKey);


    try {
        // On récupère les données depuis la base de données en utilisant la méthode passée en argument
        // On renvoie les données récupérées au client sous forme de réponse JSON

        res.status(200).json(dataBaseMethod);
    } catch (e) {
        // Si une erreur survient lors de la récupération des données depuis la base de données, on renvoie une erreur 500 au client avec un message d'erreur personnalisé
        res.status(500).json({error: `erreur dans le traitement de ${dataBaseMethod}`})
    }

}