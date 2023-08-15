import * as path from 'path';
import * as fs from 'fs';
import {AppDataSource} from "../../data-source.config";


//Todo simplifier la fonction pour améliorer lecture et maintenabilité
export default async function generateEntityDtoTypescriptDocument(entity: Function) {

    //Définir le repertoire dans lequel est enregistré le document typescript ainsi que le nom du document typescript
    const directoryPath = path.join(__dirname, `../../../../src/dto/${entity.name.toLowerCase()}.dto.ts`);

    //Définir entityRepository qui contient les informations de la table Entity
    const entityMetadata = (await AppDataSource.initialize()).manager.getRepository(entity).metadata

    //Définir entityColumns qui contient les informations des colonnes de la table Entity
    const entityColumns = entityMetadata.columns


    //Définir entityRelations qui contient les informations des relations de la table Entity
    const entityRelations = entityMetadata.relations

    //Définir entityRelationsNames qui contient les noms des relations de la table Entity
    let entityRelationsNames: string[] = []

    //Définir usedColumnsAndRelationsNamesAndTypes qui contient les noms et les types des colonnes et des relations de la table Entity
    let usedColumnsAndRelationsNamesAndTypes: object[] = []

    let fileContent: string = ``

    if (entityRelations.length !== 0) {

        entityRelations.forEach(entityRelation => {
            entityRelationsNames.push(entityRelation.propertyName)

            if (typeof entityRelation.type !== "string") {
                fileContent += `import {${entityRelation.type.name}} from \'../entity/${entityRelation.type.name.toLowerCase()}.entity\';\n`;
            }

        })

        fileContent += `\n`


    }

    fileContent += `export class ${entity.name}Dto {\n`

    entityColumns.forEach(entityColumn => {

        let type: string

        if (! bannedColumns.has(entityColumn.propertyName) && ! entityRelationsNames.includes(entityColumn.propertyName)){

            switch (true){
                case number.has(entityColumn.type.toString()):
                    type = 'number'
                    break;
                case  string.has(entityColumn.type.toString()):
                    type = 'string'
                    break;
                case date.has(entityColumn.type.toString()):
                    type = 'Date'
                    break;
            }

            usedColumnsAndRelationsNamesAndTypes.push({propertyName: entityColumn.propertyName, propertyType: type})
            fileContent += `readonly ${entityColumn.propertyName}: ${type};\n`

        }

    })

    entityRelations.forEach(entityRelation => {

        if (typeof entityRelation.type !== "string") {

            let type : string

            switch (entityRelation.relationType.toString()) {

                case 'one-to-one':
                    type = `${entityRelation.type.name}`
                    break;
                case 'one-to-many':
                    type = `${entityRelation.type.name}[]`
                    break;
                case 'many-to-one':
                    type = `${entityRelation.type.name}`
                    break;
                case 'many-to-many':
                    type = `${entityRelation.type.name}[]`
                    break;

            }

            usedColumnsAndRelationsNamesAndTypes.push({propertyName: entityRelation.propertyName, propertyType: type})
            fileContent += `readonly ${entityRelation.propertyName}:  ${type};\n`
        }

    })

    fileContent += `\nconstructor(`

    usedColumnsAndRelationsNamesAndTypes.forEach(usedColumnAndRelationNameAndType => {
        fileContent += `${usedColumnAndRelationNameAndType['propertyName']}: ${usedColumnAndRelationNameAndType['propertyType']}, `
    })

    fileContent +=`){\n`

    usedColumnsAndRelationsNamesAndTypes.forEach(usedColumnAndRelationNameAndType => {

        fileContent += `this.${usedColumnAndRelationNameAndType['propertyName']} = ${usedColumnAndRelationNameAndType['propertyName']}\n`;
    })

    fileContent+= `}\n`

    fileContent += `}`

    fs.writeFileSync(directoryPath, fileContent)
    console.log(`Generated ${entity.name.toLowerCase()}.dto.ts file successfully`);

}

const number: Set<string> = new Set<string>([
    'tinyint',
    'smallint',
    'mediumint',
    'int',
    'integer',
    'bigint',
    'float',
    'double',
    'numeric'
])

const string: Set<string> = new Set<string>([
    'tinytext',
    'mediumtext',
    'text',
    'longtext',
    'char',
    'varchar'
])

const date: Set<string> = new Set<string>([
    'date',
    'datetime',
    'time',
    'timestamp'
])

const bannedColumns: Set<string> = new Set<string>([
    'createdAt',
    'updatedAt'
])