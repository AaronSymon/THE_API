import * as cache from 'memory-cache';
import {Request} from 'express';


export default function searchCache(req: Request) : boolean {

    let isCachedExisting = cache.get(req.url)

    return !!isCachedExisting;

}