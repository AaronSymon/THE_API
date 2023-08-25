import * as path from 'path';
import * as fs from 'fs';
import {TheObject} from "../../types";
export default function generateTheCache (theObject: TheObject): void {

    const entity = theObject.entity;
    const entityName = entity.entityName;
    const isEntityCached = theObject.cache.isEntityCached;

    const directoryPath = path.join(__dirname, '../../cache');


    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    const filePath = path.join(directoryPath, `${entityName}.cache.ts`);

    let fileContent = `import {${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}} from '../entity/${entityName}.entity';
    import {entityCache} from "../types";
    
    export const ${entityName}Cache : entityCache = {
    
        entity : ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)},
        isEntityCached : ${isEntityCached}
    
    }
    `

    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated ${entityName}.cache File`)

}