import { Request, Response } from 'express';
import {ObjectLiteral} from "typeorm";
import * as cache from 'memory-cache';


//Fonction createCache, elle crée un cache pour les données retournées par une requête HTTP.
//createCache function, it creates a cache for the data returned by an HTTP request.
export default function createCache(req: Request, res: Response, dataBaseMethod: ObjectLiteral) {

    // Stocker l'URL de la requête HTTP dans une variable cacheKey.
    //Stock the URL of the HTTP request in a CACHEKEY variable.
    const cacheKey = req.url;

    // Stocker les données du cache correspondant à cacheKey dans une variable cachedData.
    //Store the cache data corresponding to cacheKey in a cachedData variable.
    const cachedData = dataBaseMethod;

        // Stocker les données obtenues dans le cache pour une utilisation ultérieure.
        //Store the data obtained in the cache for later use.
        cache.put(cacheKey, cachedData, Number(process.env.CA_TIMER));

        //Retourner les donner dans la réponse de la requête HTTP.
        //Return the data in the HTTP request response.
        return res.status(200).json(cachedData);

}