import * as path from 'path';
import * as fs from 'fs'
import * as process from 'process';
import * as dotenv from 'dotenv';
import {AppDataSource} from "../../data-source.config";
import {searchEntityDto} from "../dtos/searchEntityDto";
import {dtosArray} from "../../array/dtos.array";
import {getFunctionParams} from "../functions/getFunctionParams";

dotenv.config()

//Focntion generateSwaggerTypescriptDocument qui permet de générer un document typescript contenant les informations du document swagger
//Function generateSwaggerTypescriptDocument which allows to generate a typescript document containing the informations of the swagger document
export default async function generateSwaggerTypescriptDocument(entityArray: Function[]) {

    //Définir le repertoire dans lequel est enregistré le document typescript ainsi que le nom du document typescript
    //Define the directory in which the typescript document is saved as well as the name of the typescript document
    const directoryPath = path.join(__dirname, `../../../../swagger.ts`);

    //Définir dataSource pour récupérer les informations des entités à partir de la base de données
    //Define dataSource to retrieve entity informations from the database
    const dataSource = await AppDataSource.initialize()

    //Définir une variable fileContent qui contiendra les informations du document swagger à générer
    //Define a fileContent variable which will contain the informations of the swagger document to generate
    let fileContent: string = `const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});
    
const doc: object = {
    
    info:{
        version: '${process.env.APP_VERSION}',
        title : '${process.env.APP_NAME}',
        description : '${process.env.APP_DESCRIPTION}'
    },
    host : 'localhost:${process.env.SV_PORT}',
    basePath: '/',
    schemes: ['http'],
    securityDefinitions: {
    apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "Type into the textbox: Bearer {your JWT token}." //JWT token is generated from the login route.
        }
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
    
        ${entityArray.map(entity => {
            return `
            //${entity.name} Tag
            {
                'name': '${entity.name}',
                'description': '${entity.name} endpoint'
            }
            `})}
    
    ],
        definitions: {
            ${entityArray.map(entity => {

                //Définir entityMetadata qui contient les informations de la table Entity
                //Define entityMetadata which contains the informations of the Entity table
                const entityMetadata = dataSource.manager.getRepository(entity).metadata
        
                //Définir entityColumns qui contient les informations des colonnes de la table Entity
                //Define entityColumns which contains the informations of the columns of the Entity table
                const entityColumns = entityMetadata.columns
        
                //Définir entityRelations qui contient les informations des relations de la table Entity
                //Define entityRelations which contains the informations of the relations of the Entity table
                const entityRelations = entityMetadata.relations
        
                //Définir entityRelationsNames qui contient les informations des relations de la table Entity
                //Define entityRelationsNames which contains the informations of the relations of the Entity table
                let entityRelationsNames: string[] = []
        
                //Pour chaque relation de la table Entity, ajouter le nom de la relation dans entityRelationsNames
                //For each relation of the Entity table, add the name of the relation in entityRelationsNames
                entityRelations.forEach(entityRelation => {
                    entityRelationsNames.push(entityRelation.propertyName)
                })

                //Définir entityDto qui contient les informations du dto de la table Entity
                //Define entityDto which contains the informations of the Entity table dto
                const entityDto = searchEntityDto(dtosArray, `${entity.name}`)
        
                //Définir entityDtoParams qui contient les informations des paramètres du dto de la table Entity
                //Define entityDtoParams which contains the informations of the parameters of the Entity table dto
                const entityDtoParams = getFunctionParams(entityDto)
                
                //Définir entityDefinitionsContent qui contiendra les informations des définitions de la table Entity
                //Define entityDefinitionsContent which will contain the informations of the definitions of the Entity table
                let entityDefinitionsContent: string = `
                //${entity.name} Definition
                ${entity.name} : {
    
                    ${entityColumns.map(entityColumn => {
                       
                        //Si la colonne n'est pas une colonne interdite et que la colonne n'est pas une relation, ajouter la colonne dans entityDefinitionsContent
                        //If the column is not a banned column and the column is not a relation, add the column in entityDefinitionsContent
                        if (! bannedColumns.has(entityColumn.propertyName) && ! entityRelationsNames.includes(entityColumn.propertyName)) {
        
                        return `${entityColumn.propertyName}: '${entityColumn.type}',
                        `
                        }
                        
                    }).join(``)}
                    ${entityRelations.map(entityRelation => {
                        
                        //Si le type de la relation n'est pas une string, ajouter la relation dans entityDefinitionsContent
                        //If the type of the relation is not a string, add the relation in entityDefinitionsContent
                        if (typeof entityRelation.type !== "string") {
                            
                            //Définir entityRelationMetadata qui contient les informations de la table de la relation
                            //Define entityRelationMetadata which contains the informations of the relation table
                            const entityRelationMetadata = dataSource.manager.getRepository(entityRelation.type).metadata
                            
                            //Définir entityRelationColumns qui contient les informations des colonnes de la table de la relation   
                            //Define entityRelationColumns which contains the informations of the columns of the relation table
                            const entityRelationColumns = entityRelationMetadata.columns
                            
                            //En fonctiion du type de de la relation
                            switch (entityRelation.relationType.toString()) {
    
                                //Si la relation est de type one-to-one
                                //If the relation is of type one-to-one
                                case 'one-to-one':
                                    
                                    //Ajouter la relation dans entityDefinitionsContent
                                    //Add the relation in entityDefinitionsContent
                                    return `${entityRelation.propertyName} : {
                                        ${entityRelationColumns.map(entityRelationColumn => {
                                            
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {
                                                    
                                            return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                        `
                                                    
                                                }
                                                
                                            }).join(``)}
                                    },
                                    `;
                                
                                //Si la relation est de type one-to-many
                                //If the relation is of type one-to-manys
                                case 'one-to-many':
                                    
                                    //Ajouter la relation dans entityDefinitionsContent
                                    //Add the relation in entityDefinitionsContent
                                    return `${entityRelation.propertyName} : [
                                        {
                                            ${entityRelationColumns.map(entityRelationColumn => {
                                                
                                                    if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {
                                                        
                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                        `
                                                        
                                                    }
                                                
                                            }).join(``)}
                                        }
                                    ],
                                    `
                                
                                //Si la relation est de type many-to-one
                                //If the relation is of type many-to-one
                                case 'many-to-one':
                                    
                                    //Ajouter la relation dans entityDefinitionsContent
                                    //Add the relation in entityDefinitionsContent
                                    return `${entityRelation.propertyName} : {
                                        ${entityRelationColumns.map(entityRelationColumn => {
                                            
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {
                                                    
                                                return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                    `
                                                    
                                                }
                                    }).join(``)}
                                    },
                                    `
                                    
                                //Si la relation est de type many-to-many
                                //If the relation is of type many-to-many
                                case 'many-to-many':
                                    
                                    //Ajouter la relation dans entityDefinitionsContent
                                    //Add the relation in entityDefinitionsContent
                                    return `${entityRelation.propertyName} : [
                                        {
                                            ${entityRelationColumns.map(entityRelationColumn => {
                                                
                                                    if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {
                                                        
                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                        `
                                                        
                                                    }
                                    }).join(``)}
                                        }
                                    ],
                                    `
    
                            }
                            
                        }
                        
                    }).join(``)
                    }
                    },
                    //_________________
                    
                    //${entity.name}Dto Definition
                    ${entity.name}Dto : {
                        
                        ${entityColumns.map(entityColumn => {

                            if (entityDtoParams.includes(entityColumn.propertyName)) {

                                //Si la colonne n'est pas une colonne interdite et que la colonne n'est pas une relation, ajouter la colonne dans entityDefinitionsContent
                                //If the column is not a banned column and the column is not a relation, add the column in entityDefinitionsContent
                                if (! bannedColumns.has(entityColumn.propertyName) && ! entityRelationsNames.includes(entityColumn.propertyName)) {

                                    return `${entityColumn.propertyName}: '${entityColumn.type}',
                                `
                                }
                            }

                        }).join(``)}
                        ${entityRelations.map(entityRelation => {

                            if (entityDtoParams.includes(entityRelation.propertyName)) {
                                //Si le type de la relation n'est pas une string, ajouter la relation dans entityDefinitionsContent
                                //If the type of the relation is not a string, add the relation in entityDefinitionsContent
                                if (typeof entityRelation.type !== "string") {

                                    //Définir entityRelationMetadata qui contient les informations de la table de la relation
                                    //Define entityRelationMetadata which contains the informations of the relation table
                                    const entityRelationMetadata = dataSource.manager.getRepository(entityRelation.type).metadata
                                    
                                    //Définir entityRelationColumns qui contient les informations des colonnes de la table de la relation
                                    //Define entityRelationColumns which contains the informations of the columns of the relation table
                                    const entityRelationColumns = entityRelationMetadata.columns

                                    //En fonctiion du type de de la relation
                                    //In function of the type of the relation
                                    switch (entityRelation.relationType.toString()) {

                                        //Si la relation est de type one-to-one
                                        //If the relation is of type one-to-one
                                        case 'one-to-one':

                                            //Ajouter la relation dans entityDefinitionsContent
                                            //Add the relation in entityDefinitionsContent
                                            return `${entityRelation.propertyName} : {
                                                
                                                ${entityRelationColumns.map(entityRelationColumn => {

                                                //Si la colonne n'est pas une colonne interdite, ajouter la colonne dans entityDefinitionsContent
                                                //If the column is not a banned column, add the column in entityDefinitionsContent
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {

                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                `

                                                }

                                            }).join(``)}
                                            },
                                            `;

                                        //Si la relation est de type one-to-many
                                        //If the relation is of type one-to-many
                                        case 'one-to-many':

                                            //Ajouter la relation dans entityDefinitionsContent
                                            //Add the relation in entityDefinitionsContent
                                            return `${entityRelation.propertyName} : [
                                                {
                                                    ${entityRelationColumns.map(entityRelationColumn => {

                                                //Si la colonne n'est pas une colonne interdite, ajouter la colonne dans entityDefinitionsContent
                                                //If the column is not a banned column, add the column in entityDefinitionsContent  
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {

                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                                `

                                                }

                                            }).join(``)}
                                                }
                                            ],
                                            `

                                        //Si la relation est de type many-to-one
                                        //If the relation is of type many-to-one
                                        case 'many-to-one':

                                            //Ajouter la relation dans entityDefinitionsContent
                                            //Add the relation in entityDefinitionsContent
                                            return `${entityRelation.propertyName} : {
                                                ${entityRelationColumns.map(entityRelationColumn => {

                                                //Si la colonne n'est pas une colonne interdite, ajouter la colonne dans entityDefinitionsContent
                                                //If the column is not a banned column, add the column in entityDefinitionsContent
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {

                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                            `

                                                }
                                            }).join(``)}
                                            },
                                            `

                                        //Si la relation est de type many-to-many
                                        //If the relation is of type many-to-many
                                        case 'many-to-many':

                                            //Ajouter la relation dans entityDefinitionsContent
                                            //Add the relation in entityDefinitionsContent
                                            return `${entityRelation.propertyName} : [
                                                {
                                                    ${entityRelationColumns.map(entityRelationColumn => {

                                                //Si la colonne n'est pas une colonne interdite, ajouter la colonne dans entityDefinitionsContent
                                                //If the column is not a banned column, add the column in entityDefinitionsContent
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {

                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                                `

                                                }
                                            }).join(``)}
                                                }
                                            ],
                                            `

                                    }

                                }
                            }
        
                        }).join(``)}
                    
                    },
                    //_________________
                    `
        
                
        
                return entityDefinitionsContent
    
            }).join(``)}
            
        }
        
}

const outputFile : string = 'build/swagger-output.json';
const endpointsFiles : string[] = ['build/src/index.js', 'build/src/tools/swagger/swaggerImplement/**/*.swaggerImplement.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(async() => {
    await import ('./src/index.js'); // Your project's root file
});

    `;

    //Ecrire le contenu du fichier dans le fichier swagger.js
    //Write the content of the file in the swagger.js file
    fs.writeFileSync(directoryPath, fileContent)

}

const bannedColumns: Set<string> = new Set<string>([
    'id',
    'role',
    'createdAt',
    'updatedAt'
])

const entityRelationBannedColumn: Set<string> = new Set<string>([
    'role',
    'createdAt',
    'updatedAt'
])