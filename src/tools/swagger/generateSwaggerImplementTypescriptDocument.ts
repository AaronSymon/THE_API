import * as path from 'path';
import * as fs from 'fs'
import {getEntityPropertiesName} from "../entities/getEntityPropertyNames";
import researchEntityPersonnalizedControllers from "../router/personalizedController/researchEntityPersonnalizedControllers";

//Fonction generateSwaggerImplementTypescriptDocument, permet de générer le document swagger pour une entité donnée
//Fucntion generateSwaggerImplementTypescriptDocument, used to generate swagger document for a given entity
export default async function generateSwaggerImplementTypescriptDocument(entity: Function) {

    //Déclaration du chemin du fichier à générer
    //Declaration of the file path to generate
    const directoryPath = path.join(__dirname, `../../../../src/tools/swagger/swaggerImplement/${entity.name.toLowerCase()}.swaggerImplement.ts`);

    //Déclaration du nom des propriétés de l'entité
    //Declaration of the entity properties names
    const entityPropertiesNames: String[] = getEntityPropertiesName(entity);

    //Déclaration des controllers personnalisés
    //Declaration of personalized controllers
    const personalizedControllers: personalizedController[] = await researchEntityPersonnalizedControllers(entity);

    //Déclaration du contenu du fichier à générer
    //Declaration of the file content to generate
    let fileContent = `//Import express
const express = require('express');
import { Request, Response } from 'express';
    
//Declare App
const app = express()

//Import entity ${entity.name}
import {${entity.name}} from "../../../entity/${entity.name.toLowerCase()}.entity";

//Import du dto de l'entité ${entity.name}
import { ${entity.name}Dto } from '../../../dto/${entity.name.toLowerCase()}.dto';

//Import entity ${entity.name}Access
import {${entity.name.toLowerCase()}Access} from "../../../access/${entity.name.toLowerCase()}.access";

//Import httpMethodsToDataBase
import getOne from "../../../tools/httpMethodToDataBase/getOne";
import getAll from "../../../tools/httpMethodToDataBase/getAll";
import insert from "../../../tools/httpMethodToDataBase/insert";
import update from "../../../tools/httpMethodToDataBase/update";
import deleteOne from "../../../tools/httpMethodToDataBase/deleteOne";

//Import Middleware
import verifyToken from "../../../tools/jwt/verifyToken";
import {verifyUserAccessMiddleware} from "../../access/verifyUserAccessByRole";

${personalizedControllers.length > 0 ?

        `//Import des controllers spécifiques
        import {${personalizedControllers.map(personalizedController => `${personalizedController.controllerName} `).join(',') }} from "../../../router/personalizedController/${entity.name.toLowerCase()}.personalizedController";
        //Import de la fonction permettant de renvoyer le dto d'un controller spécifique
        import sendDtoResultFromPersonalizedController from "../../../tools/router/personalizedController/sendDtoResultFromPersonalizedController";
        `

        :
        ``
    }

//Import cache
import * as cache from 'memory-cache';
import {${entity.name.toLowerCase()}Cache} from "../../../cache/${entity.name.toLowerCase()}.cache";
import createCache from "../../../tools/caches/createCache";
import deleteCache from "../../../tools/caches/deleteCache";
import searchCache from "../../../tools/caches/searchCache";

//Déclaration du controller ${entity.name.toLowerCase()}
export const ${entity.name.toLowerCase()}Controller = 

//Méthode GET pour récupérer toutes les instances de ${entity.name.toLowerCase()}
app.get('/${entity.name.toLowerCase()}', verifyToken, verifyUserAccessMiddleware(${entity.name.toLowerCase()}Access), async (req: Request, res: Response) => {

    /*
        #swagger.tags= ['${entity.name}']
        #swagger.description = "${entity.name} endPoint pour récupérer l'ensemble des instances de ${entity.name} en base de données"
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.responses[200] = {
            schema: {$ref: '#/definitions/${entity.name}Dto'},
            description: "Array[] of ${entity.name}",
        }
    */

    //Exécuter le code contenu dans le bloc try pour récupérer toutes les instances de ${entity.name}
    try {
    
        //Vérifier si ${entity.name} est à mettre en cache
        switch (${entity.name.toLowerCase()}Cache.isEntityCached) {
        
            //Si ${entity.name} est à mettre en cache
            case true:
                
                //Vérifier si ${entity.name} est déjà en cache
                let isCachedExisting : boolean = searchCache(req)
                
                //Si ${entity.name} est déjà en cache   
                if(isCachedExisting) {
                   
                   //Récupérer ${entity.name} en cache
                   return res.status(200).json(cache.get(req.url))
                   
                }
                
                //Si ${entity.name} n'est pas en cache, le mettre en cache
                // @ts-ignore
                return createCache(req, res, await getAll <${entity.name}, ${entity.name}Dto>(${entity.name}, ${entity.name}Dto))
                        
            //Si ${entity.name} n'est pas à mettre en cache
            case false:
            
                //Récupérer toutes les instances de ${entity.name}
                // @ts-ignore
                return res.status(200).json(await getAll <${entity.name}, ${entity.name}Dto>(${entity.name}, ${entity.name}Dto));
                   
        }
    
    //Si une erreur est survenue, renvoyer une réponse avec le code 500
    } catch (e) {
    
        //console.log(e);
        
        return res.status(500).json({message: 'Une erreur est survenue, imposible de récupérer les instances de ${entity.name}'});

    
    }

});

//Méthode GET pour récupérer une instance de ${entity.name.toLowerCase()} par son id
app.get('/${entity.name.toLowerCase()}/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entity.name.toLowerCase()}Access), async (req: Request, res: Response) => {

    /*
            #swagger.tags= ['${entity.name}']
            #swagger.description = "${entity.name} endPoint pour récupérer l'instance de ${entity.name} correspondant à l'id en base de données"
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.parameters['id(\\\\d+)'] = {description: '${entity.name} id'}
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entity.name}Dto'},
                description: "Instance of ${entity.name}"
            }
    */

    //Exécuter le code contenu dans le bloc try pour récupérer une instance de ${entity.name.toLowerCase()} par son id
    try {
    
        //Vérifier si ${entity.name} est à mettre en cache
        switch (${entity.name.toLowerCase()}Cache.isEntityCached) {
           
            //Si ${entity.name} est à mettre en cache
            case true:
               
                //Vérifier si ${entity.name} est déjà en cache
                let isCachedExisting : boolean = searchCache(req)
               
                //Si ${entity.name} est déjà en cache
                if(isCachedExisting) {
                
                    //Récupérer ${entity.name} en cache
                    return res.status(200).json(cache.get(req.url))
                    
                }
                
                //Si ${entity.name} n'est pas en cache, le mettre en cache
                // @ts-ignore
                return createCache(req,res, await getOne<${entity.name}, ${entity.name}Dto>(${entity.name}, Number(req.params.id), ${entity.name}Dto))
                           
            //Si ${entity.name} n'est pas à mettre en cache
            case false:
           
                //Récupérer une instance de ${entity.name} par son id
                // @ts-ignore
                return res.status(200).json(await getOne<${entity.name}, ${entity.name}Dto>(${entity.name}, Number(req.params.id), ${entity.name}Dto))
                   
        }
    
    //Si une erreur est survenue, renvoyer une réponse avec le code 500
    } catch (e) {
    
        //console.log(e);
        return res.status(500).json({message: \`Une erreur est survenue, imposible de récupérer une instance de ${entity.name} avec id \${req.params.id}\`});
    
    }

});

${personalizedControllers.map((personalizedController)=>{
        return `//Méthode GET pour récupérer une ou des instance(s) de ${entity.name} ${personalizedController.controllerParams.length > 0 ? 'par : ' + personalizedController.controllerParams.map((controllerParam) => { return controllerParam.paramName}).join(',') : ''}
        app.get('/${entity.name.toLowerCase()}/${personalizedController.controllerName}/${personalizedController.controllerParams.length > 0 ? personalizedController.controllerParams.map((controllerParam) => {return `:${controllerParam.paramName}${controllerParam.paramRegex}` }).join('/') : ''}', verifyToken, verifyUserAccessMiddleware(${entity.name.toLowerCase()}Access), async (req: Request, res: Response) => {
        
            /*
            #swagger.tags= ['${entity.name}']
            #swagger.description = "${entity.name} endPoint pour récupérer une ou des instance(s) de ${entity.name} ${personalizedController.controllerParams.length > 0 ? 'par : ' + personalizedController.controllerParams.map((controllerParam) => { return controllerParam.paramName}).join(',') : ''}
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entity.name}Dto'},
                description: "Array[] of ${entity.name}",
            }
            */
        
            //Exécuter le code contenu dans le bloc try pour récupérer une ou des instance(s) de ${entity.name.toLowerCase()} ${personalizedController.controllerParams.length > 0 ? 'par : ' + personalizedController.controllerParams.map((controllerParam) => { return controllerParam.paramName}).join(',') : ''}
            try {
            
                //Vérifier si ${entity.name} est à mettre en cache
                switch (${entity.name.toLowerCase()}Cache.isEntityCached) {
                
                    //Si ${entity.name} est à mettre en cache
                    case true:
                    
                        //Vérifier si ${entity.name} est déjà en cache
                        let isCachedExisting : boolean = searchCache(req)
                        
                        //Si ${entity.name} est déjà en cache
                        if(isCachedExisting) {
                        
                            //Récupérer ${entity.name} en cache
                            return res.status(200).json(cache.get(req.url))
                            
                        }
                        
                        //Si ${entity.name} n'est pas en cache, le mettre en cache
                        return createCache(req, res, await sendDtoResultFromPersonalizedController(await ${personalizedController.controllerName}(${personalizedController.controllerParams.length > 0 ? personalizedController.controllerParams.map((controllerParam) => {return `req.params.${controllerParam.paramName}`}).join(',') : ''}) , ${entity.name}))
                        
                    //Si ${entity.name} n'est pas à mettre en cache
                    case false:
                    
                        //Récupérer une ou des instance(s) de ${entity.name} ${personalizedController.controllerParams.length > 0 ? 'par : ' + personalizedController.controllerParams.map((controllerParam) => { return controllerParam.paramName}).join(',') : ''}
                        return res.status(200).json(await sendDtoResultFromPersonalizedController(await ${personalizedController.controllerName}(${personalizedController.controllerParams.length > 0 ? personalizedController.controllerParams.map((controllerParam) => {return `req.params.${controllerParam.paramName}`}).join(',') : ''}) , ${entity.name}) )
                
                }
            
            } catch (e) {
            
                //console.log(e);
                return res.status(500).json({message: \`Une erreur est survenue, imposible de récupérer une ou des instance(s) de ${entity.name.toLowerCase()} ${personalizedController.controllerParams.length > 0 ? 'par : ' + personalizedController.controllerParams.map((controllerParam) => { return controllerParam.paramName}).join(',') : ''}\`});
            
            }
        
        });
        
        `
    }).join('')}

//Méthode POST pour créer une instance de ${entity.name.toLowerCase()}
app.post('/${entity.name.toLowerCase()}', verifyToken, verifyUserAccessMiddleware(${entity.name.toLowerCase()}Access), async (req: Request, res: Response) => {

    /*
            #swagger.tags= ['${entity.name}']
            #swagger.description = "${entity.name} endPoint pour insérer une instance de ${entity.name} en base de données "
            #swagger.security = [{
                "apiKeyAuth": []
            }]
            #swagger.requestBody = {
                required: true,
                schema: {$ref: '#/definitions/${entity.name}'},
            }
            #swagger.responses[200] = {
                schema: {$ref: '#/definitions/${entity.name}Dto'},
                description: "${entity.name} inserted successfully"
            }
    */

    //Exécuter le code contenu dans le bloc try pour créer une instance de ${entity.name.toLowerCase()}
    try {
    
        //Créer une instance de ${entity.name.toLowerCase()}
        let ${entity.name.toLowerCase()}ToInsert: ${entity.name} = new ${entity.name}()
        
        //Affecter les valeurs des propriétés de ${entity.name.toLowerCase()} avec les valeurs contenues dans le corps de la requête
        ${entityPropertiesNames.map((propertyName: string) => `${entity.name.toLowerCase()}ToInsert.${propertyName} = req.body.${propertyName}`).join('\n        ')}
        
        //Vérifier si ${entity.name.toLowerCase()} est à mettre en cache
        switch (${entity.name.toLowerCase()}Cache.isEntityCached) {
        
            //Si ${entity.name.toLowerCase()} est à mettre en cache
            case true:
                
                //Vérifier si ${entity.name.toLowerCase()} est déjà en cache
                let isCachedExisting : boolean = searchCache(req)
                
                //Si ${entity.name.toLowerCase()} est déjà en cache
                if (isCachedExisting) {
                
                    //Supprimer ${entity.name.toLowerCase()} du cache et insérer ${entity.name.toLowerCase()} dans la base de données
                    await deleteCache(req, res, await insert(${entity.name}, ${entity.name.toLowerCase()}ToInsert))
                    
                    break;
                
                }
                //Si ${entity.name.toLowerCase()} n'est pas en cache, insérer ${entity.name.toLowerCase()} dans la base de données
                await insert(${entity.name}, ${entity.name.toLowerCase()}ToInsert)
                
                res.status(201).json({message: 'Une instance de ${entity.name.toLowerCase()} a été créée avec succès'})
                
                break;
                
            //Si ${entity.name.toLowerCase()} n'est pas à mettre en cache    
            case false:
                //Insérer ${entity.name.toLowerCase()} dans la base de données
                await insert(${entity.name}, ${entity.name.toLowerCase()}ToInsert)
                
                res.status(201).json({message: 'Une instance de ${entity.name.toLowerCase()} a été créée avec succès'})
            
                break;
        
        }
        
    //Si une erreur est survenue, renvoyer une réponse avec le code 500    
    } catch (e) {
    
        //console.log(e);
        res.status(500).json({message: 'Une erreur est survenue, imposible de créer une instance de ${entity.name.toLowerCase()}'});
        return;
    
    }

});

//Méthode UPDATE pour mettre à jour une instance de ${entity.name.toLowerCase()} par son id
app.put('/${entity.name.toLowerCase()}/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entity.name.toLowerCase()}Access), async (req: Request, res: Response) => {

    /*
        #swagger.tags= ['${entity.name}']
        #swagger.description = "${entity.name} endPoint pour mettre à jour une instance de ${entity.name} en base de données "
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['id(\\\\d+)'] = {description: '${entity.name} id'}
        #swagger.requestBody = {
            required: true,
            schema: {$ref: '#/definitions/${entity.name}'}
        }
        #swagger.responses[200] = {
            schema: {$ref: '#/definitions/${entity.name}Dto'},
            description: "${entity.name} updated successfully"
        }   
    */

    //Exécuter le code contenu dans le bloc try pour mettre à jour une instance de ${entity.name.toLowerCase()} par son id 
    try {
    
        //Créer une instance de ${entity.name}
        let ${entity.name.toLowerCase()}ToUpdate: ${entity.name} = new ${entity.name}()
        
        //Déclarer une variable pour stocker l'instance de ${entity.name} mise à jour
        let updated;
        
        //Affecter les valeurs des propriétés de ${entity.name.toLowerCase()}ToUpdate avec les valeurs contenues dans le corps de la requête
        ${entityPropertiesNames.map((propertyName: string) => `${entity.name.toLowerCase()}ToUpdate.${propertyName} = req.body.${propertyName}`).join('\n        ')}
        
        //Vérifier si ${entity.name} est à mettre en cache
        switch (${entity.name.toLowerCase()}Cache.isEntityCached) {
        
            //Si ${entity.name} est à mettre en cache
            case true:
                
                //Vérifier si ${entity.name} est déjà en cache
                let isCachedExisting : boolean = searchCache(req)
                
                //Si ${entity.name} est déjà en cache
                if(isCachedExisting) {
                    
                    //Supprimer ${entity.name} du cache et mettre à jour ${entity.name} dans la base de données
                    //@ts-ignore
                    return await deleteCache(req, res, await update<${entity.name}, ${entity.name}Dto>(${entity.name}, Number(req.params.id), ${entity.name.toLowerCase()}ToUpdate, ${entity.name}Dto))
                
                }
            
                //Si ${entity.name} n'est en cache, mettre à jour ${entity.name} dans la base de données
                //@ts-ignore
                updated = await update<${entity.name}, ${entity.name}Dto>(${entity.name}, Number(req.params.id), ${entity.name.toLowerCase()}ToUpdate, ${entity.name}Dto)
                
                //Envoyer une réponse avec le code 200 et l'instance de ${entity.name} mise à jour
                return res.status(200).json(updated)
                        
            //Si ${entity.name} n'est pas à mettre en cache    
            case false:
            
                //Mettre à jour ${entity.name} dans la base de données
                //@ts-ignore
                updated = await update<${entity.name}, ${entity.name}Dto>(${entity.name}, Number(req.params.id), ${entity.name.toLowerCase()}ToUpdate, ${entity.name}Dto)
                
                //Envoyer une réponse avec le code 200 et l'instance de ${entity.name} mise à jour
                return res.status(200).json(updated)
                    
        }
    //Si une erreur est survenue, renvoyer une réponse avec le code 500
    } catch (e) {
    
        //console.log(e);
        return res.status(500).json({message: \`Une erreur est survenue, imposible de mettre à jour une instance de ${entity.name} avec id \${req.params.id}\`});
    
    }

});

//Méthode DELETE pour supprimer une instance de ${entity.name.toLowerCase()} par son id
app.delete('/${entity.name.toLowerCase()}/:id(\\\\d+)', verifyToken, verifyUserAccessMiddleware(${entity.name.toLowerCase()}Access), async (req: Request, res: Response) => {


    /*
        #swagger.tags= ['${entity.name}']
        #swagger.description = "${entity.name} endPoint pour supprimer l'instance de ${entity.name} correspondant à l'id en base de données"
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['id(\\\\d+)'] = {description: '${entity.name} id'}
        #swagger.responses[200] = {
            schema: {$ref: '#/definitions/${entity.name}Dto'},
            description: "${entity.name} deleted successfully"
        }
    */
    
    //Exécuter le code contenu dans le bloc try pour supprimer une instance de ${entity.name.toLowerCase()} par son id
    try {
    
        //Déclarer une variable pour stocker l'instance de ${entity.name} supprimée
        let deleted;
    
        //Vérifier si ${entity.name} est à mettre en cache
        switch (${entity.name.toLowerCase()}Cache.isEntityCached) {
        
            //Si ${entity.name} est à mettre en cache
            case true:
            
                //Vérifier si ${entity.name} est déjà en cache
                const isCachedExisting : boolean = searchCache(req)
                
                //Si ${entity.name} est déjà en cache
                if(isCachedExisting) {
                
                    //Supprimer ${entity.name} du cache et supprimer ${entity.name} de la base de données
                    //@ts-ignore
                    return await deleteCache(req, res, await deleteOne<${entity.name}>(${entity.name}, Number(req.params.id)))
                
                }
                
                //Si ${entity.name} n'est pas en cache, supprimer ${entity.name} de la base de données
                //@ts-ignore
                deleted = await deleteOne<${entity.name}>(${entity.name}, Number(req.params.id))
                
                //Envoyer une réponse avec le code 200 et l'instance de ${entity.name.toLowerCase()} supprimée
                return res.status(200).json(deleted);
                            
            //Si ${entity.name} n'est pas à mettre en cache    
            case false:
            
                //Supprimer ${entity.name.toLowerCase()} de la base de données
                //@ts-ignore
                deleted = await deleteOne<${entity.name}>(${entity.name}, Number(req.params.id));
                
                //Envoyer une réponse avec le code 200 et l'instance de ${entity.name.toLowerCase()} supprimée
                return res.status(200).json(deleted);
                    
        }
    
    //Si une erreur est survenue, renvoyer une réponse avec le code 500
    } catch (e) {
    
        //console.log(e);
        return res.status(500).json({message: \`Une erreur est survenue, imposible de supprimer une instance de ${entity.name} avec id \${req.params.id}\`});
    
    }

});

`

    //Ecrire le contenu du fichier dans le fichier ${entity.name.toLowerCase()}.swaggerImplement.ts
    //Write the file content in the ${entity.name.toLowerCase()}.swaggerImplement.ts file
    fs.writeFileSync(directoryPath, fileContent)

    console.log(`${entity.name.toLowerCase()}.swaggerImplement.ts generated successfully`)

    return;

}