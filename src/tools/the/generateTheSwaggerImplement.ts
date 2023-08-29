import * as path from 'path';
import * as fs from 'fs';
import { TheObject } from '../../types';
export default function generateTheSwaggerImplement(theObject: TheObject) {

    const entity = theObject.entity;
    const entityName = entity.entityName;

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
    
    });`


    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated ${entityName}.swaggerImplement File`)

}