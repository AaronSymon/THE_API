import * as path from 'path';
import * as fs from 'fs';
import { TheObject } from '../../types';
export default function generateTheSwaggerImplement(theObject: TheObject) {

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

    let controllerWithoutAccessVerification : boolean | string = theObject.access.some(access => access.userRole === undefined);

    if (controllerWithoutAccessVerification) {
        const access = theObject.access.find(access => access.userRole === undefined);
        const httpMethods = Array.from(access.httpMethods);
        const getAccessParams = access.getAccessParams ? access.getAccessParams : [];
        const getAccessRelations = access.getAccessRelations ? access.getAccessRelations : [];

        controllerWithoutAccessVerification = `
        
        ${httpMethods.includes("GET") ? `//Get Method to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database without access verification
        app.get('/${entityName}/no_auth/', async (req: Request, res: Response) => {
        
            /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} without access verification"

            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "Array[] of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}",
            }

            #swagger.responses[500] = {
                schema: {message: "An error occurred while trying to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}"},
                description: "Error: Internal Server Error"
            }
            */
        
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

            accessParam === "id" ? accessParamRegex = "\\\\d+" : undefined;

            return`//Get Method to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by ${accessParam} from database without access verification
                app.get('/${entityName}/no_auth/${accessParam}/:${accessParam}${accessParamRegex ? `(${accessParamRegex})` : ``}', async (req: Request, res: Response) => {
                
                    /*
                    #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
                    #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to get one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id without access verification"
                    #swagger.parameters['${accessParam}${accessParamRegex}'] = {description: '${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} ${accessParam}'}
                    #swagger.responses[200] = {
                        schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                        description: "Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}"
                    }
                    #swagger.responses[500] = {
                        schema: {message: "An error occurred while trying to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by ${accessParam}"},
                        description: "Error: Internal Server Error"
                    }
                    */  
                
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
            app.get('/${entityName}/no_auth/${accessRelation}', async (req: Request, res: Response) => {
            
            
                /*
                #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
                #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation} without access verification"
                #swagger.responses[200] = {
                    schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                    description: "Array of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation}"
                }
                #swagger.responses[500] = {
                    schema: {message: "An error occurred while trying to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation}"},
                    description: "Error: Internal Server Error"
                }
                */
            
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
        app.post('/${entityName}/no_auth/', async (req: Request, res: Response) => {
        
                /*
                    #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
                    #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to insert one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} without access verification"
                    #swagger.requestBody = {
                        required: true,
                        schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'},
                    }
                    #swagger.responses[200] = {
                        schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                        description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} inserted successfully"
                    }
                    #swagger.responses[201] = {
                        schema: {message: 'Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} created successfully.'},
                        description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} created"
                    }
                    #swagger.responses[500] = {
                        schema: {message: 'An error occured while inserting ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'},
                        description: "Error: Internal Server Error"
                    }
            */
        
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
        ${ httpMethods.includes("PUT") ? `//Put Method to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database without access verification
        app.put('/${entityName}/no_auth/:id(\\\\d+)', async (req: Request, res: Response) => {
        
            /*
                #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
                #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id without access verification"
                #swagger.parameters['id(\\\\d+)'] = {description: '${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} id'}
                #swagger.requestBody = {
                    required: true,
                    schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'}
                }
                #swagger.responses[200] = {
                    schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                    description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} updated successfully"
                }   
                #swagger.responses[500] = {
                    schema: {message: 'An error occured while updating ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id'},
                    description: "Error: Internal Server Error"
                }
            */
        
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
                return res.status(500).json({message: 'An error occurred while trying to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'});
            
            }
        
        });
        ` : ``}
        ${ httpMethods.includes("DELETE") ? `//Delete Method to delete one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} in database without access verification
        app.delete('/${entityName}/no_auth/:id(\\\\d+)', async (req: Request, res: Response) => {
        
            /*
                #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
                #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to delete one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id without access verification"
                #swagger.parameters['id(\\\\d+)'] = {description: '${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} id'}
                #swagger.responses[200] = {
                    schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                    description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} deleted successfully"
                }
                #swagger.responses[500] = {
                    schema: {message: 'An error occured while deleting ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id'},
                    description: "Error: Internal Server Error"
                }
            */
        
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

    const directoryPath = path.join(__dirname, '../swagger/swaggerImplement');

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    const filePath = path.join(directoryPath, `${entityName}.swaggerImplement.ts`);

    let fileContent = `//Import Express
    const express = require('express');
    import { Request, Response } from 'express';
    
    //Declare App
    const app = express()
    
    //Import entity ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
    import  {${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}}  from '../../../entity/${entityName}.entity';
    
    //Import entityDto ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto
    import { ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto } from '../../../dto/${entityName}.dto';
    
    //Import Access
    import {${entityName}Access} from "../../../access/${entityName}.access";
    
    //Import HttpMethodsToDatabase
    import getOne from "../../httpMethodToDataBase/getOne";
    import getAll from "../../httpMethodToDataBase/getAll";
    import insert from "../../httpMethodToDataBase/insert";
    import update from "../../httpMethodToDataBase/update";
    import deleteOne from "../../httpMethodToDataBase/deleteOne";
    ${accessParams.length > 0 ? `import getByAccessParam from "../../httpMethodToDataBase/getByAccessParam";` : ``}
    ${accessRelations.length > 0 ? `import getEntityAndAccessRelation from "../../httpMethodToDataBase/getEntityAndAccessRelation";` : ``}
    
    //Import Middleware
    import verifyToken from "../../jwt/verifyToken";
    import {verifyUserAccessMiddleware} from "../../access/verifyUserAccessByRole";
    
    //Import Cache
    import * as cache from 'memory-cache';
    import {${entityName}Cache} from "../../../cache/${entityName}.cache";
    import createCache from "../../caches/createCache";
    import deleteCache from "../../caches/deleteCache";
    import searchCache from "../../caches/searchCache";
    
    //Declare Controller for ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}
    export const ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Controller =
    
    //Get Method to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} from database
    app.get('/${entityName}', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}"
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "Array[] of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}",
            }
            #swagger.responses[401] = {
                schema: {message: "Token is required. Access denied."},
                description: "Error: unauthorized",
            }
            #swagger.responses[403] = {
                schema: {message: 'Invalid token. Access denied. || Access denied.'},
                description: "Error: Forbidden",
            }
            #swagger.responses[500] = {
                schema: {message: "An error occurred while trying to get all ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}"},
                description: "Error: Internal Server Error"
            }
        */
    
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
    app.get('/${entityName}/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to get one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id"
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.parameters['id(\\\\d+)'] = {description: '${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} id'}
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}"
            }
            #swagger.responses[401] = {
            schema: {message: "Token is required. Access denied."},
            description: "Error: unauthorized",
            }
            #swagger.responses[403] = {
            schema: {message: 'Invalid token. Access denied. || Access denied.'},
            description: "Error: Forbidden",
            }   
            #swagger.responses[500] = {
                schema: {message: "An error occurred while trying to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id"},
                description: "Error: Internal Server Error"
            }
        */
    
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
        app.get('/${entityName}/${accessParam}/:${accessParam}${accessParamRegex ? `(${accessParamRegex})` : ``}', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
        
            /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to get one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id"
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.parameters['${accessParam}${accessParamRegex}'] = {description: '${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} ${accessParam}'}
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}"
            }
            #swagger.responses[401] = {
            schema: {message: "Token is required. Access denied."},
            description: "Error: unauthorized",
            }
            #swagger.responses[403] = {
            schema: {message: 'Invalid token. Access denied. || Access denied.'},
            description: "Error: Forbidden",
            }   
            #swagger.responses[500] = {
                schema: {message: "An error occurred while trying to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by ${accessParam}"},
                description: "Error: Internal Server Error"
            }
            */  
        
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
        app.get('/${entityName}/${accessRelation}', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
        
            /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation}"
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "Array of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation}"
            }
            #swagger.responses[401] = {
            schema: {message: "Token is required. Access denied."},
            description: "Error: unauthorized",
            }
            #swagger.responses[403] = {
            schema: {message: 'Invalid token. Access denied. || Access denied.'},
            description: "Error: Forbidden",
            }   
            #swagger.responses[500] = {
                schema: {message: "An error occurred while trying to get ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} and associated ${accessRelation}"},
                description: "Error: Internal Server Error"
            }
            */  
        
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
                        return res.status(200).json(await getEntityAndAccessRelation <${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, ${accessRelation.charAt(0).toUpperCase()}${accessRelation.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto>(${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}, "${accessRelation}", ${accessRelation.charAt(0).toUpperCase()}${accessRelation.slice(1)}, ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto));
                
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
    app.post('/${entityName}', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
    
        /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to insert one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}"
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.requestBody = {
                required: true,
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'},
            }
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} inserted successfully"
            }
            #swagger.responses[201] = {
                schema: {message: 'Instance of ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} created successfully.'},
                description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} created"
            }
            #swagger.responses[401] = {
            schema: {message: "Token is required. Access denied."},
            description: "Error: unauthorized",
            }
            #swagger.responses[403] = {
            schema: {message: 'Invalid token. Access denied. || Access denied.'},
            description: "Error: Forbidden",
            }
            #swagger.responses[500] = {
                schema: {message: 'An error occured while inserting ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'},
                description: "Error: Internal Server Error"
            }
    */
    
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
    app.put('/${entityName}/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to update one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id "
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.parameters['id(\\\\d+)'] = {description: '${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} id'}
            #swagger.requestBody = {
                required: true,
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}'}
            }
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} updated successfully"
            }   
            #swagger.responses[401] = {
                schema: {message: "Token is required. Access denied."},
                description: "Error: unauthorized",
            }
            #swagger.responses[403] = {
                schema: {message: 'Invalid token. Access denied. || Access denied.'},
                description: "Error: Forbidden",
            }
            #swagger.responses[500] = {
                schema: {message: 'An error occured while updating ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id'},
                description: "Error: Internal Server Error"
            }
        */
    
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
    app.delete('/${entityName}/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entityName}Access), async (req: Request, res: Response) => {
    
        /*
            #swagger.tags= ['${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}']
            #swagger.description = "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} endPoint to delete one ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id"
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.parameters['id(\\\\d+)'] = {description: '${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} id'}
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto'},
                description: "${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} deleted successfully"
            }
            #swagger.responses[401] = {
                schema: {message: "Token is required. Access denied."},
                description: "Error: unauthorized",
            }
            #swagger.responses[403] = {
                schema: {message: 'Invalid token. Access denied. || Access denied.'},
                description: "Error: Forbidden",
            }
            #swagger.responses[500] = {
                schema: {message: 'An error occured while deleting ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} by id'},
                description: "Error: Internal Server Error"
            }
        */
    
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
    
    });
    
    ${controllerWithoutAccessVerification ? controllerWithoutAccessVerification : ``}
    
    `


    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated ${entityName}.swaggerImplement File`)

}