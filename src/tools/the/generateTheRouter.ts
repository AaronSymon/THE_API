import * as path from 'path';
import * as fs from 'fs';
import { TheObject } from '../../types';
//Fonction pour générer les fichiers router
export default function generateTheRouter (theObject: TheObject): void {

    const entity = theObject.entity;
    const entityName = entity.entityName;
    let accessParams : string[] = [];
    let accessRelations: string [] = []

    //Si des accès sont définis pour l'entité
    //If accesses are defined for the entity
    if(theObject.access) {
        //Pour chacun des accès
        //For each access
        theObject.access.forEach(access => {
            //Si des paramètres d'accès sont définis
            //If access parameters are defined
            if (access.getAccessParams) {
                //Pour chacun des paramètres d'accès
                //For each access parameter
                access.getAccessParams.forEach(accessParam => {
                    //Si le paramètre d'accès n'est pas déjà dans le tableau des paramètres d'accès et que ce n'est pas l'id
                    //If the access parameter is not already in the access parameters array and it's not the id
                    //Ajouter le paramètre d'accès au tableau des paramètres d'accès (accessParams)
                    //Add the access parameter to the access parameters array (accessParams)
                    accessParam !== "id" && ! accessParams.includes(accessParam) ? accessParams.push(accessParam) : ``;
                })
            }

        })
    }

    //Si des accès sont définis pour l'entité
    //If accesses are defined for the entity
    if(theObject.access) {
        //Pour chacun des accès
        //For each access
        theObject.access.forEach(access => {
            //Si des relations d'accès sont définies
            //If access relations are defined
            if (access.getAccessRelations) {
                //Pour chacune des relations d'accès
                access.getAccessRelations.forEach(accessRelation => {
                    //Si la relation d'accès n'est pas déjà dans le tableau des relations d'accès (accessRelations), l'on l'ajoute
                    //If the access relation is not already in the access relations array (accessRelations), we add it
                    ! accessRelations.includes(accessRelation) ? accessRelations.push(accessRelation) : ``;
                })
            }

        })
    }

    //Vérifier si le contrôleur dispose d'une méthode sans vérification d'accès (userRole === undefined)
    //Check if the controller has a method without access verification (userRole === undefined)
    let controllerWithoutAccessVerification : boolean | string = theObject.access.some(access => access.userRole === undefined);

    //Si le contrôleur dispose d'une méthode sans vérification d'accès
    //If the controller has a method without access verification
    if (controllerWithoutAccessVerification) {
        //Récupérer l'accès sans vérification d'accès parmis les différents types d'accès déclarés
        //Get the access without access verification among the different types of access declared
        const access = theObject.access.find(access => access.userRole === undefined);
        //Récupérer les méthodes HTTP déclarées pour l'accès sans vérification d'accès
        //Get the HTTP methods declared for the access without access verification
        const httpMethods = Array.from(access.httpMethods);
        //Récupérer les paramètres d'accès pour l'accès sans vérification d'accès
        //Get the access parameters for the access without access verification
        const getAccessParams = access.getAccessParams ? access.getAccessParams : [];
        //Récupérer les relations d'accès pour l'accès sans vérification d'accès
        //Get the access relations for the access without access verification
        const getAccessRelations = access.getAccessRelations ? access.getAccessRelations : [];

        //Générer le contrôleur sans vérification d'accès
        //Generate the controller without access verification
        controllerWithoutAccessVerification = `
        
        ${ httpMethods.includes("GET") ? `//Get Method to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database without access verification
        ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/public/', async (req: Request, res: Response) => {
        
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
        ` : ``}
        ${httpMethods.includes("GET") && getAccessParams.length > 0 ? getAccessParams.map(accessParam => {

            const accessParamType = entity.columns && entity.columns.length > 0 ? entity.columns.find(column => column.name === accessParam)?.type : ``;
            let accessParamRegex : string | undefined = undefined;

            switch (accessParamType) {
                case "string":
                    accessParamRegex = "\\\\w+";
                    break;
                case "number":
                    accessParamRegex = "\\\\d+";
                    break;
            }

            accessParam === "id" ? accessParamRegex = "\\\\d+" : ``;

            return `//Get Method to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by ${accessParam} from database without access verification
                ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/public/${accessParam}/:${accessParam}${accessParamRegex ? `(${accessParamRegex})` : ``}', async (req: Request, res: Response) => {
                
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
        `): ``}
        
        ${httpMethods.includes("GET") && getAccessRelations.length > 0 ? getAccessRelations.map(accessRelation => {

            return`//Get Method to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation} from database without access verification
            ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/public/${accessRelation}', async (req: Request, res: Response) => {
            
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
        `): ``}
        
        ${ httpMethods.includes("POST") ? `//Post Method to insert one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database without access verification
        ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.post('/public/', async (req: Request, res: Response) => {
        
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
            
            } catch (error) {
            
                //console.log(error);
                return res.status(500).json({message: 'An error occurred while trying to insert one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'});
            
            }
        
        });
        ` : ``}
        
        ${httpMethods.includes("PUT") ? `//Put Method to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database without access verification
        ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.put('/public/:id(\\\\d+)', async (req: Request, res: Response) => {
        
            try {
            
                let updated : ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} | undefined;
            
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
                return res.status(500).json({message: 'An error occurred while trying to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'});
            
            }
        
        });
        ` : ``}
        ${ httpMethods.includes("DELETE") ? `//Delete Method to delete one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database without access verification
        ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.delete('/public/:id(\\\\d+)', async (req: Request, res: Response) => {
        
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
                return res.status(500).json({message: 'An error occurred while trying to delete one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'});
            
            }
        
        });
        ` : ``}
        `
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
    import {${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}} from '../entity/${entityName}.entity';
    
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
    ${accessParams.length > 0 ? `import getByAccessParam from "../tools/httpMethodToDataBase/getByAccessParam";`: ``}
    ${accessRelations.length > 0 ? `import getEntityAndAccessRelation from "../tools/httpMethodToDataBase/getEntityAndAccessRelation";`: ``}
    
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

        const accessParamType = entity.columns && entity.columns.length > 0 ? entity.columns.find(column => column.name === accessParam)?.type : ``;
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
        ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Router.get('/${accessParam}/:${accessParam}${accessParamRegex ? `(${accessParamRegex})` : ``}', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
        
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
    `) : ``}
    
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
    `): ``}
    
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
        
            let updated : ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} | undefined;
        
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
        
            let deleted : string;
        
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
    
    });
    
    ${controllerWithoutAccessVerification ? controllerWithoutAccessVerification : ``}
    

`

    fs.writeFileSync(filePath, fileContent);
    console.log(`Generated ${entityName}.router File`);

};