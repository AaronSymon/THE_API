import * as path from 'path';
import * as fs from 'fs';
import { TheObject } from '../../types';
export default function generateTheRouter (theObject: TheObject): void {

    const entity = theObject.entity;
    const entityName = entity.entityName;
    let accessParams : string[] = [];
    let accessRelations: string [] = []

    if(theObject.access) {
        theObject.access.forEach(access => {

            if (access.getAccessParams) {
                access.getAccessParams.forEach(accessParam => {
                    accessParam !== "id" && ! accessParams.includes(accessParam) ? accessParams.push(accessParam) : undefined;
                })
            }

        })
    }

    if(theObject.access) {
        theObject.access.forEach(access => {

            if (access.getAccessRelations) {
                access.getAccessRelations.forEach(accessRelation => {
                    ! accessRelations.includes(accessRelation) ? accessRelations.push(accessRelation) : undefined;
                })
            }

        })
    }

    const directoryPath = path.join(__dirname, '../../router');

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    const filePath = path.join(directoryPath, `${entityName}.router.ts`);

    let fileContent = `//Import Express
    const express = require('express');
    import { Request, Response } from 'express';
    
    //Import entity ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
    import  {${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}}  from '../entity/${entityName}.entity';
    
    //Import entityDto ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto
    import { ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto } from '../dto/${entityName}.dto';
    
    //Import entityAccess ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Access
    import {${entityName}Access} from "../access/${entityName}.access";
    
    //Import HttpMethodsToDatabase
    import getOne from "../../src/tools/httpMethodToDataBase/getOne";
    import getAll from "../../src/tools/httpMethodToDataBase/getAll";
    import insert from "../../src/tools/httpMethodToDataBase/insert";
    import update from "../../src/tools/httpMethodToDataBase/update";
    import deleteOne from "../../src/tools/httpMethodToDataBase/deleteOne";
    ${accessParams.length > 0 ? `import getByAccessParam from "../tools/httpMethodToDataBase/getByAccessParam";`: undefined}
    ${accessRelations.length > 0 ? `import getEntityAndAccessRelation from "../tools/httpMethodToDataBase/getEntityAndAccessRelation";`: undefined}
    
    //Import Middleware
    import verifyToken from "../../src/tools/jwt/verifyToken";
    import {verifyUserAccessMiddleware} from "../tools/access/verifyUserAccessByRole";
    
    //Import Cache
    import * as cache from 'memory-cache';
    import {${entityName}Cache} from "../cache/${entityName}.cache";
    import createCache from "../../src/tools/caches/createCache";
    import deleteCache from "../../src/tools/caches/deleteCache";
    import searchCache from "../../src/tools/caches/searchCache";
    
    //Declare Router for ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
    export const ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router = express.Router();
    
    //Get Method to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database
    ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        try {
        
            //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
            switch (${entityName}Cache.isEntityCached) {
            
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                case true:
                
                    //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    let isCachedExisting : boolean = searchCache(req);
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    if(isCachedExisting) {
                   
                       //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from cache
                       return res.status(200).json(cache.get(req.url));
                   
                    }
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} isn't already cached, cache it
                    // @ts-ignore
                    return createCache(req, res, await getAll <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
                
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} haven't to be cached
                case false:
                
                    //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database
                    // @ts-ignore
                    return res.status(200).json(await getAll <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
            
            }
        
        //If an error occurred, send a 500 error message
        } catch (error) {
        
            //console.log(error);
            return res.status(500).json({message: 'An error occurred while trying to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'});
        
        }
    
    });
    
    //Get Method to get one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database
    ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        try {
        
            //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
            switch (${entityName}Cache.isEntityCached) {
            
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                case true:
                
                    //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    let isCachedExisting : boolean = searchCache(req);
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    if(isCachedExisting) {
                    
                        //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from cache
                        return res.status(200).json(cache.get(req.url));
                    
                    }
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} isn't already cached, cache it
                    // @ts-ignore
                    return createCache(req, res, await getOne <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id), ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
                
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} haven't to be cached
                case false:
                
                    //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database
                    // @ts-ignore
                    return res.status(200).json(await getOne <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id), ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
            
            }
        
        //If an error occurred, send a 500 error message
        } catch (error) {
        
            //console.log(error);
            return res.status(500).json({message: 'An error occurred while trying to get one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id \${req.params.id}'});
        
        }
    
    });
    
    ${accessParams.length > 0 ? accessParams.map(accessParam => {
        
        const accessParamType = entity.columns && entity.columns.length > 0 ? entity.columns.find(column => column.name === accessParam)?.type : undefined;
        let accessParamRegex : string | undefined = undefined;
        
        switch (accessParamType) {
            case "string":
                accessParamRegex = "\\\\w+";
                break;
            case "number":
                accessParamRegex = "\\\\d+";
                break;
        }
            
        return`//Get Method to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by ${accessParam} from database
        ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/${accessParam}/:${accessParam}${accessParamRegex ? `(${accessParamRegex})` : undefined}', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
        
            try {
            
                //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                switch (${entityName}Cache.isEntityCached) {
                
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                    case true:
                    
                        //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                        let isCachedExisting : boolean = searchCache(req);
                        
                        //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                        if(isCachedExisting) {
                        
                                //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from cache
                                return res.status(200).json(cache.get(req.url));
                        
                        }
                        
                        //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} isn't already cached, cache it
                        // @ts-ignore
                        return createCache(req, res, await getByAccessParam <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, "${accessParam}", req.params.${accessParam}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} haven't to be cached
                    case false:
                    
                        //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database
                        // @ts-ignore
                        return res.status(200).json(await getByAccessParam <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, "${accessParam}", req.params.${accessParam}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
                
                }
            
            } catch (error) {
                //console.log(error);
                return res.status(500).json({message: 'An error occurred while trying to get one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by ${accessParam} \${req.params.${accessParam}}'});
            }
        });
    `
    }).join(`
    `) : undefined}
    
    ${accessRelations.length > 0 ? accessRelations.map(accessRelation => {
        
        return`//Get Method to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation} from database
        ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/${accessRelation}', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
        
            try {
            
                //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                switch (${entityName}Cache.isEntityCached) {
                
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                    case true:
                    
                        //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                        let isCachedExisting : boolean = searchCache(req);
                        
                        //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                        if(isCachedExisting) {
                            //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from cache
                                return res.status(200).json(cache.get(req.url));
                        }
                        
                        //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} isn't already cached, cache it
                        // @ts-ignore
                        return createCache(req, res, await getEntityAndAccessRelation <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, "${accessRelation}", ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
                        
                    
                    //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} haven't to be cached
                    case false:
                    
                        //Get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation} from database
                        // @ts-ignore
                        return res.status(200).json(await getEntityAndAccessRelation <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, "${accessRelation}", ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
                
                }
            
            } catch (error) {
                //console.log(error);
                return res.status(500).json({message: 'An error occurred while trying to get one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation}'});
            }
        });
        `
        
    }).join(`
    `): undefined}
    
    //Post Method to insert one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database 
    ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.post('/', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        try {
        
            //Create an instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
            let ${entityName}ToInsert: ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} = new ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}();
            
            //Hydrate ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} with request body
            ${entity.columns && entity.columns.length > 0 ? entity.columns.map(column => !("default" in column.options) ? `${entityName}ToInsert.${column.name} = req.body.${column.name};`: "").join(`
            `) :""}
            ${entity.relations && entity.relations.length > 0 ? entity.relations.map(relation => `${entityName}ToInsert.${relation.name} = req.body.${relation.name};`).join(`
            `) :""}
            
            //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
            switch (${entityName}Cache.isEntityCached) {
            
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                case true:
                
                    //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    let isCachedExisting : boolean = searchCache(req);
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    if(isCachedExisting) {
                    
                        //Delete ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from cache and insert it in database
                        await deleteCache(req, res, await insert (${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName}ToInsert));
                        
                        return res.status(201).json({message: 'Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} created successfully.'})
                        
                    }
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} isn't already cached, insert it in database
                    await insert (${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName}ToInsert);
                    
                    return res.status(201).json({message: 'Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} created successfully.'})
                
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} haven't to be cached
                case false:
                
                //Insert ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database
                await insert (${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName}ToInsert);
                
                return res.status(201).json({message: 'Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} created successfully.'})
            
            }
        
        //If an error occurred, send a 500 error message
        } catch (error) {
        
            //console.log(error);
            return res.status(500).json({message: 'An error occurred while trying to insert one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'});
        
        }
    
    });
    
    //Put Method to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database
    ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.put('/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        try {
        
            let updated;
        
            //Create an instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
            let ${entityName}ToUpdate: ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} = new ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}();
            
            //Hydrate ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} with request body
            ${entity.columns && entity.columns.length > 0 ? entity.columns.map(column => !("default" in column.options) ?`${entityName}ToUpdate.${column.name} = req.body.${column.name};` : "").join(`
            `) :""}
            ${entity.relations && entity.relations.length > 0 ? entity.relations.map(relation => `${entityName}ToUpdate.${relation.name} = req.body.${relation.name};`).join(`
            `) :""}
            
            //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
            switch (${entityName}Cache.isEntityCached) {
            
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                case true:
                
                    //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    let isCachedExisting : boolean = searchCache(req);
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    if(isCachedExisting) {
                    
                        //Delete ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from cache and update it in database
                        // @ts-ignore
                        return await deleteCache(req, res, await update <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id), ${entityName}ToUpdate, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));                    
                    }
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} isn't already cached, update it in database
                    // @ts-ignore
                    updated = await update <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id), ${entityName}ToUpdate, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto);
                    
                    //Send a 200 status code and the updated ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
                    return res.status(200).json(updated);
                
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} haven't to be cached
                case false:
                
                    //Update ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database    
                    // @ts-ignore
                    updated = await update <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id), ${entityName}ToUpdate, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto);
                    
                    //Send a 200 status code and the updated ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
                    return res.status(200).json(updated);
            
            }
        
        //If an error occurred, send a 500 error message
        } catch (error) {
        
            //console.log(error);
            return res.status(500).json({message: 'An error occurred while trying to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id \${req.params.id}'});
        
        }
    
    });
    
    //Delete Method to delete one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database
    ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.delete('/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        try {
        
            let deleted;
        
            //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
            switch (${entityName}Cache.isEntityCached) {
            
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} have to be cached
                case true:
                
                    //Check if ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    let isCachedExisting : boolean = searchCache(req);
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} is already cached
                    if(isCachedExisting) {
                    
                        //Delete ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from cache and delete it in database
                        // @ts-ignore
                        return await deleteCache(req, res, await deleteOne <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id)));
                    
                    }
                    
                    //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} isn't already cached, delete it in database
                    // @ts-ignore
                    deleted = await deleteOne <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id));
                    
                    //Send a 200 status code and the deleted ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
                    return res.status(200).json(deleted);
                
                //If ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} haven't to be cached
                case false:
                
                    //Delete ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database
                    // @ts-ignore
                    deleted = await deleteOne <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, Number(req.params.id));
                    
                    //Send a 200 status code and the deleted ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
                    return res.status(200).json(deleted);
            
            }
        
        //If an error occurred, send a 500 error message
        } catch (error) {
        
            //console.log(error);
            return res.status(500).json({message: 'An error occurred while trying to delete one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id \${req.params.id}'});
        
        }
    
    });`

    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated ${entityName}.router File`)

}