import * as path from 'path';
import * as fs from 'fs';
import {TheObject} from "../../types";
export default function generateTheAccess (theObject: TheObject): void {

    const entity = theObject.entity;
    const entityName = entity.entityName;
    const accesses = theObject.access;

    const directoryPath = path.join(__dirname, '../../access');

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    const filePath = path.join(directoryPath, `${entityName}.access.ts`);

    let fileContent = `import {entityAccess} from "../types";
    export const ${entityName}Access : Set<entityAccess> = new Set([
    
    ${accesses.length > 0 ? accesses.map(access => `{
        userRole: "${access.userRole}",
        accessMethods: new Set([${Array.from(access.httpMethods).map(httpMethod => `"${httpMethod}"`).join(`, `)}]),
        getAccessParams: [${access.getAccessParams && access.getAccessParams.length > 0 ? access.getAccessParams.map(param => `"${param}"`).join(`, `) : ""}],
        getAccessRelations: [${access.getAccessRelations && access.getAccessRelations.length > 0 ? access.getAccessRelations.map(relation => `"${relation}"`).join(`, `) : ""}]
    }`).join(`,
    `) : ""}
    
    ])
    `

    fs.writeFileSync(filePath, fileContent)
    console.log(`Generated ${entityName}.access File`)

}