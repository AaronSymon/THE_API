import * as path from 'path';
import * as fs from 'fs'
import * as process from 'process';
import * as dotenv from 'dotenv';
import {AppDataSource} from "../../data-source.config";
import {searchEntityDto} from "../dtos/searchEntityDto";
import {dtosArray} from "../../array/dtos.array";
import {getFunctionParams} from "../functions/getFunctionParams";

dotenv.config()

export default async function generateSwaggerTypescriptDocument(entityArray: Function[]) {

    //Définir le repertoire dans lequel est enregistré le document typescript ainsi que le nom du document typescript
    const directoryPath = path.join(__dirname, `../../../../swagger.ts`);

    //Définir dataSource pour récupérer les informations des entités à partir de la base de données
    const dataSource = await AppDataSource.initialize()

    //Définir une variable fileContent qui contiendra les informations du document swagger à générer
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
                const entityMetadata = dataSource.manager.getRepository(entity).metadata
        
                //Définir entityColumns qui contient les informations des colonnes de la table Entity
                const entityColumns = entityMetadata.columns
        
                //Définir entityRelations qui contient les informations des relations de la table Entity
                const entityRelations = entityMetadata.relations
        
                //Définir entityRelationsNames qui contient les informations des relations de la table Entity
                let entityRelationsNames: string[] = []
        
                //Pour chaque relation de la table Entity, ajouter le nom de la relation dans entityRelationsNames
                entityRelations.forEach(entityRelation => {
                    entityRelationsNames.push(entityRelation.propertyName)
                })

                //Définir entityDto qui contient les informations du dto de la table Entity
                const entityDto = searchEntityDto(dtosArray, `${entity.name}`)
        
                //Définir entityDtoParams qui contient les informations des paramètres du dto de la table Entity
                const entityDtoParams = getFunctionParams(entityDto)
                
                //Définir entityDefinitionsContent qui contiendra les informations des définitions de la table Entity
                let entityDefinitionsContent: string = `
                //${entity.name} Definition
                ${entity.name} : {
    
                    ${entityColumns.map(entityColumn => {
                       
                        //Si la colonne n'est pas une colonne interdite et que la colonne n'est pas une relation, ajouter la colonne dans entityDefinitionsContent
                        if (! bannedColumns.has(entityColumn.propertyName) && ! entityRelationsNames.includes(entityColumn.propertyName)) {
        
                        return `${entityColumn.propertyName}: '${entityColumn.type}',
                        `
                        }
                        
                    }).join(``)}
                    ${entityRelations.map(entityRelation => {
                        
                        //Si le type de la relation n'est pas une string, ajouter la relation dans entityDefinitionsContent
                        if (typeof entityRelation.type !== "string") {
                            
                            const entityRelationMetadata = dataSource.manager.getRepository(entityRelation.type).metadata
                            const entityRelationColumns = entityRelationMetadata.columns
                            
                            switch (entityRelation.relationType.toString()) {
    
                                case 'one-to-one':
                                    
                                    return `${entityRelation.propertyName} : {
                                        ${entityRelationColumns.map(entityRelationColumn => {
                                            
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {
                                                    
                                            return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                        `
                                                    
                                                }
                                                
                                            }).join(``)}
                                    },
                                    `;
                                
                                case 'one-to-many':
                                    
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
                                
                                case 'many-to-one':
                                    
                                    return `${entityRelation.propertyName} : {
                                        ${entityRelationColumns.map(entityRelationColumn => {
                                            
                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {
                                                    
                                                return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                    `
                                                    
                                                }
                                    }).join(``)}
                                    },
                                    `
                                    
                                case 'many-to-many':
                                    
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
                                if (! bannedColumns.has(entityColumn.propertyName) && ! entityRelationsNames.includes(entityColumn.propertyName)) {

                                    return `${entityColumn.propertyName}: '${entityColumn.type}',
                                `
                                }
                            }

                        }).join(``)}
                        ${entityRelations.map(entityRelation => {

                            if (entityDtoParams.includes(entityRelation.propertyName)) {
                                //Si le type de la relation n'est pas une string, ajouter la relation dans entityDefinitionsContent
                                if (typeof entityRelation.type !== "string") {

                                    const entityRelationMetadata = dataSource.manager.getRepository(entityRelation.type).metadata
                                    const entityRelationColumns = entityRelationMetadata.columns

                                    switch (entityRelation.relationType.toString()) {

                                        case 'one-to-one':

                                            return `${entityRelation.propertyName} : {
                                                ${entityRelationColumns.map(entityRelationColumn => {

                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {

                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                `

                                                }

                                            }).join(``)}
                                            },
                                            `;

                                        case 'one-to-many':

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

                                        case 'many-to-one':

                                            return `${entityRelation.propertyName} : {
                                                ${entityRelationColumns.map(entityRelationColumn => {

                                                if (! entityRelationBannedColumn.has(entityRelationColumn.propertyName)) {

                                                    return `${entityRelationColumn.propertyName}: '${entityRelationColumn.type}',
                                                            `

                                                }
                                            }).join(``)}
                                            },
                                            `

                                        case 'many-to-many':

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