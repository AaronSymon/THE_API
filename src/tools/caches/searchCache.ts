import * as cache from 'memory-cache';
import {Request} from 'express';

//Fonction searchCache, permet de vérifier si une requête est déjà en cache
//Function searchCache, allows to check if a request is already cached
export default function searchCache(req: Request) : boolean {

    //Vérifier si la requête est déjà en cache
    //Check if the request is already cached
    let isCachedExisting = cache.get(req.url);

    //Si la requête est déjà en cache, retourner true
    //If the request is already cached, return true
    return !!isCachedExisting;
};