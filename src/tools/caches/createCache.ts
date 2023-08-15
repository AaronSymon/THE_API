import { Request, Response } from 'express';
import {ObjectLiteral} from "typeorm";
import * as cache from 'memory-cache';


export default function createCache(req: Request, res: Response, dataBaseMethod: ObjectLiteral) {

    // Stocke l'URL de la requête HTTP dans une variable CACHEKEY
    const cacheKey = req.url;

    // Vérifie si cachedData contient des données
        // Si CACHEDDATA n'existe pas, exécute la méthode de base de données pour obtenir les données
        const result = dataBaseMethod;

        // Stocke les données obtenues dans le cache pour une utilisation ultérieure
        cache.put(cacheKey, result, Number(process.env.CA_TIMER));

        // Renvoie les données à l'aide de la méthode de réponse HTTP json
        res.status(200).json(result);



}