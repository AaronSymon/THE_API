import * as path from 'path';
import * as fs from 'fs';
import {TheObject} from "../../types";

//Fonction qui génère le fichier dto pour une entité spécifique
//Function that generates the dto file for a specific entity
export default function generateTheDto (theObject: TheObject): void {

    const entity = theObject.entity;
    const entityName = entity.entityName;
    const columns = entity.columns;
    const dtoColumns= columns.filter(column => !("dtoExcludedColumns" in entity && entity.dtoExcludedColumns.includes(column.name)))
    const Relations = entity.relations;
    const dtoRelations = Relations.filter(relation => !("dtoExcludedRelations" in entity && entity.dtoExcludedRelations.includes(relation.name)))

    //Création du dossier dto s'il n'existe pas
    const directoryPath = path.join(__dirname, '../../dto');

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    //Chemin du fichier dto
    //Dto file path
    const filePath = path.join(directoryPath, `${entityName}.dto.ts`);

    //Contenu du fichier dto
    //Dto file content
    let fileContent = `import {${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}} from "../entity/${entityName}.entity";
    ${dtoRelations.length > 0 ? dtoRelations.map(dtoRelation => `import {${dtoRelation.relationWith.charAt(0).toUpperCase()}${dtoRelation.relationWith.slice(1)}Dto} from "./${dtoRelation.relationWith}.dto";`).join(`
    `) : ""}
    
    export class ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}Dto {
    
        readonly id: number;
        ${dtoColumns.length > 0 ? dtoColumns.map(dtoColumn => `readonly ${dtoColumn.name}: ${dtoColumn.type};`).join(`
        `) : ""}
        ${dtoRelations.length > 0 ? dtoRelations.map(dtoRelation => `readonly ${dtoRelation.name}: ${dtoRelation.relationWith.charAt(0).toUpperCase()}${dtoRelation.relationWith.slice(1)}Dto ${dtoRelation.type === "ManyToMany" || dtoRelation.type === "OneToMany" ? "[]" :""}`).join(`
        `) : ""}
        
        constructor(${entityName}: ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}){
            this.id = ${entityName}.id;
            ${dtoColumns.length > 0 ? dtoColumns.map(dtoColumn => `this.${dtoColumn.name} = ${entityName}.${dtoColumn.name};`).join(`
            `) : ""}
            ${dtoRelations.length >0 ? dtoRelations.map(dtoRelation => dtoRelation.type === "OneToOne" || dtoRelation.type === "ManyToOne" ? `${entityName}.${dtoRelation.name} ? this.${dtoRelation.name} = new ${dtoRelation.name.charAt(0).toUpperCase()}${dtoRelation.name.slice(1)}Dto(${entityName}.${dtoRelation.name}) : this.${dtoRelation.name} = undefined` : `${entityName}.${dtoRelation.name} ? this.${dtoRelation.name} = ${entityName}.${dtoRelation.name}.map(${dtoRelation.relationWith} => new ${dtoRelation.relationWith.charAt(0).toUpperCase()}${dtoRelation.relationWith.slice(1)}Dto(${dtoRelation.relationWith})) : this.${dtoRelation.name} = undefined;`).join(`
            `) : ""}

        }
        
    }
    `

    //Ecriture du fichier dto
    //Writing the dto file
    fs.writeFileSync(filePath, fileContent);
    console.log(`Generated ${entityName}.dto File`);

};