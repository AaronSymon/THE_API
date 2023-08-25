import * as path from 'path';
import * as fs from 'fs';
import {TheObject} from "../../types";

export default function generateTheEntity (theObject: TheObject): void {

    const entity = theObject.entity;
    const entityName = entity.entityName;
    const columns = entity.columns;
    const relations = entity.relations;
    let relationsType: string[] = [];

    relations.forEach(relation => {
        !relationsType.includes(relation.type) ? relationsType.push(relation.type) : undefined;
    });


    const directoryPath = path.join(__dirname, '../../entity');


    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    const filePath = path.join(directoryPath, `${entityName}.entity.ts`);

    let fileContent = `import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, ${columns.length > 0 ? "Column," : ""} ${relationsType.length > 0 ? `${relationsType},` : ""} ${relationsType.length >0 && relationsType.includes("OneToOne") ? "JoinColumn," : ""} ${relationsType.length > 0 && relationsType.includes("ManyToMany") ? "JoinTable," : ""} } from "typeorm";
    ${relations.length > 0 ? relations.map(relation => `import {${relation.relationWith.charAt(0).toUpperCase()}${relation.relationWith.slice(1)}} from "./${relation.relationWith}.entity";`).join(`
    `): ""}
    
    @Entity()
    export class ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)} {
        
        @PrimaryGeneratedColumn({type: "int"})
        id : number;
    
        @CreateDateColumn({type: "datetime"})
        createdAt: Date;
    
        @UpdateDateColumn({type: "datetime"})
        updatedAt: Date;
        
        ${columns.length > 0 ? columns.map(column => `@Column({${"nullable" in column.options ? `nullable: ${column.options.nullable},`:""} ${"unique" in column.options ? `unique: ${column.options.unique},` : ""} ${"columnType" in column.options ? `type: "${column.options.columnType}",` : "" } ${"default" in column.options ? `default: "${column.options.default}",` : ""}}) 
        ${column.name}: ${column.type}`).join(`
        
        `) : ""} 
         
         ${relations.length> 0 ? relations.map(relation => `@${relation.type}(${relation.type === "OneToOne" ? `() => ${relation.relationWith.charAt(0).toUpperCase()}${relation.relationWith.slice(1)}, (${relation.relationWith}) => ${relation.relationWith}.${entity.entityName}` : ""} ${relation.type === "OneToMany" ? `() => ${relation.relationWith.charAt(0).toUpperCase()}${relation.relationWith.slice(1)}, (${relation.relationWith}) => ${relation.relationWith}.${entity.entityName}` : ""} ${relation.type === "ManyToOne" ? `() => ${relation.relationWith.charAt(0).toUpperCase()}${relation.relationWith.slice(1)}, (${relation.relationWith}) => ${relation.relationWith}.${relation.oneToManyJoinTable}` : ""} ${relation.type === "ManyToMany" ? `() => ${relation.relationWith.charAt(0).toUpperCase()}${relation.relationWith.slice(1)}, (${relation.relationWith}) => ${relation.relationWith}.${relation.manyToManyJoinTable}`: ""})
         ${relation?.type === "OneToOne" ? "@JoinColumn()" :""} ${relation.type === "ManyToMany" && "manyToManyOwningSide" in relation ? "@JoinTable()" : ""}
         ${relation.name}: ${relation.relationWith.charAt(0).toUpperCase()}${relation.relationWith.slice(1)} ${relation.type === "OneToMany" || relation.type === "ManyToMany" ? "[]" : ""}`).join(`
         
         `) : ""}  
    
    }
    `

    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated ${entityName}.entity File`)
}