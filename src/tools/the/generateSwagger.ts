import * as path from 'path';
import * as fs from 'fs';
import * as process from 'process';
import * as dotenv from 'dotenv';
import {TheColumn, TheObject, TheEntity} from "../../types";

dotenv.config();

//Fonction pour générer le fichier swagger.ts
//Function to generate the swagger.ts file
export default function generateSwagger (theObjects: TheObject[]){

    //Déclaration du chemin du répertoire
    //Declare the directory path
    const directoryPath = path.join(__dirname, '../../../');

    //Déclaration du chemin du fichier swagger.ts
    //Declare the swagger.ts file path
    const filePath = path.join(directoryPath, `swagger.ts`);

    //Déclaration du contenu du fichier swagger.ts
    //Declare the content of the swagger.ts file
    let fileContent = `const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});
    
    const doc: object = {
    
        info: {
            version: '${process.env.APP_VERSION}',
            title : '${process.env.APP_NAME}',
            description : '${process.env.APP_DESCRIPTION}'
        },
        host : 'localhost:${process.env.SV_PORT}',
        basePath : '/',
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
    
        ${theObjects.map(theObject => `//${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)} Tag
        {
            'name' : '${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)}',
            'description' : '${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)} Endpoint'
        },`).join(`
        `)}
    
    ],
    definitions: {
        ${theObjects.map(theObject => `//${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)} Definition
        
        ${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)}: {
        
        ${theObject.entity.columns && theObject.entity.columns.length > 0 ?theObject.entity.columns.map(column => !("default" in column.options) ? `${column.name} : "${column.options.columnType}",`: "").join(`
        `) : ""}
        
        ${theObject.entity.relations && theObject.entity.relations.length > 0 ? theObject.entity.relations.map(relation => {

            const relationTable = relation.relationWith
            const relationType = relation.type
            let relationColumns: string = ""
    
            if (relationType === "OneToOne" || relationType === "ManyToOne") {
                
    
                let theObjectRelation = require((`../../theObject/${relationTable}.the`))
                theObjectRelation = theObjectRelation[relationTable]
                
                const theObjectRelationColumns: TheColumn[] = theObjectRelation["entity"]["columns"]
    
                relationColumns = `{
                ${theObjectRelationColumns.map(column =>!("default" in column.options) ? `${column.name} : "${column.options.columnType}",` : "").join(`
                    `)}
                    }`
                
            }
            
            if (relationType === "OneToMany" || relationType === "ManyToMany") {
    
                let theObjectRelation : Function | TheEntity = require((`../../theObject/${relationTable}.the`));
                theObjectRelation = theObjectRelation[relationTable];
    
                const theObjectRelationColumns: TheColumn[] = theObjectRelation["entity"]["columns"];
    
                relationColumns = `[
                    { 
                    ${theObjectRelationColumns.map(column => !("default" in column.options) ? `${column.name} : "${column.options.columnType}",`: "").join(`
                        `)}
                    },
                    ]`
                
            }

            return `${relation.name} : ${relationColumns},`
        
        }).join(`
            `) :""}
                               
        },
        
        //${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)}Post Definition
        ${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)}Post: {
        
        ${theObject.entity.columns && theObject.entity.columns.length > 0 ?theObject.entity.columns.map(column => !("default" in column.options) ? `${column.name} : "${column.options.columnType}",`: "").join(`
        `) : ""}
        
        ${theObject.entity.relations && theObject.entity.relations.length > 0 ? theObject.entity.relations.map(relation => {

        const relationTable = relation.relationWith
        const relationType = relation.type
        let relationColumns: string = ""

        if (relationType === "OneToOne" || relationType === "ManyToOne") {


            let theObjectRelation = require((`../../theObject/${relationTable}.the`))
            theObjectRelation = theObjectRelation[relationTable]

            const theObjectRelationColumns: TheColumn[] = theObjectRelation["entity"]["columns"]

            relationColumns = `{
                    id : "integer",
                    }`

        }

        if (relationType === "OneToMany" || relationType === "ManyToMany") {

            let theObjectRelation : Function | TheEntity = require((`../../theObject/${relationTable}.the`));
            theObjectRelation = theObjectRelation[relationTable];

            const theObjectRelationColumns: TheColumn[] = theObjectRelation["entity"]["columns"];

            relationColumns = `[
                    {
                    id : "integer",    
                    },
                    ]`

        }

        return `${relation.name} : ${relationColumns},`

    }).join(`
            `) :""}
                               
        },        
        
        
        
        
        
        
        
        
        
        
        //${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)}Dto Definition
        
        ${theObject.entity.entityName.charAt(0).toUpperCase()}${theObject.entity.entityName.slice(1)}Dto: {
        
        ${theObject.entity.columns && theObject.entity.columns.length > 0 ? theObject.entity.columns.map(column => !("default" in column.options) && !(theObject.entity.dtoExcludedColumns && theObject.entity.dtoExcludedColumns.includes(column.name)) ? `${column.name} : "${column.options.columnType}",` : "").join(`
        `) : ""}
        
        ${theObject.entity.relations && theObject.entity.relations.length > 0 ? theObject.entity.relations.map( relation => {

        const relationTable = relation.relationWith
        const relationType = relation.type
        let relationColumns: string = ""

        if (relationType === "OneToOne" || relationType === "ManyToOne" && !(theObject.entity.dtoExcludedColumns && theObject.entity.dtoExcludedColumns.includes(relation.name))) {


            let theObjectRelation = require((`../../theObject/${relationTable}.the`))
            theObjectRelation = theObjectRelation[relationTable]

            const theObjectRelationColumns: TheColumn[] = theObjectRelation["entity"]["columns"]

            relationColumns = `{
                ${theObjectRelationColumns.map(column =>!("default" in column.options) && !(theObjectRelation.entity.dtoExcludedColumns && theObjectRelation.entity.dtoExcludedColumns.includes(column.name)) ? `${column.name} : "${column.options.columnType}",` : "").join(`
                    `)}
                    }`

        }
        
        if (relationType === "OneToMany" || relationType === "ManyToMany" && !(theObject.entity.dtoExcludedColumns && theObject.entity.dtoExcludedColumns.includes(relation.name))) {

            let theObjectRelation = require((`../../theObject/${relationTable}.the`))
            theObjectRelation = theObjectRelation[relationTable]

            const theObjectRelationColumns: TheColumn[] = theObjectRelation["entity"]["columns"]

            relationColumns = `[
                    {
                    ${theObjectRelationColumns.map(column =>!("default" in column.options) && !(theObjectRelation.entity.dtoExcludedColumns && theObjectRelation.entity.dtoExcludedColumns.includes(column.name)) ? `${column.name} : "${column.options.columnType}",` : "").join(`
                        `)}
                    },
                    ]`

        }

        return `${relation.name} : ${relationColumns},`

    }).join(`
            `) :""}
                               
        },

        
        `).join(`
        `)}
           
    },
    
    }
    
    const outputFile : string = 'build/swagger-output.json';
    //const outputFile : string = './swagger-output.json';
    const endpointsFiles : string[] = ['build/src/index.js', 'build/src/tools/swagger/swaggerImplement/**/*.swaggerImplement.js'];
    //const endpointsFiles : string[] = ['./src/index.ts', './src/tools/swagger/swaggerImplement/**/*.swaggerImplement.ts'];
    
    swaggerAutogen(outputFile, endpointsFiles, doc).then(async() => {
        await import ('./build/src/index'); // Your project's root file
    });
    
    `

    fs.writeFileSync(filePath, fileContent);
    console.log(`Generated swagger File`);

};