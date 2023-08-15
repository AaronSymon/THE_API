import * as path from 'path';
import * as fs from 'fs';
import {userRoles} from "../../access/userRoles/userRoles";
import {getEntityPropertiesName} from "../entities/getEntityPropertyNames";
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";
import {getFunctionParams} from "../functions/getFunctionParams";

export default function generateEntityAccessTypescriptDocument (entity: Function) {

    //Définir le répertoire dans lequel sera enregistré le document typescript ainsi que le nom du document
    const directoryPath = path.join(__dirname, `../../../../src/access/${entity.name.toLowerCase()}.access.ts`);

    const entityDtoParameters = getFunctionParams(searchDto(dtosArray, `${entity.name}`))
    const entityPropertyNames : string[] = getEntityPropertiesName(entity);

    let fileContent : string = ``

    fileContent += `export const ${entity.name.toLowerCase()}Access : Set<entityAccess> = new Set([`

    for( const userRole of userRoles) {

            fileContent += `
            {
                userRole: "${userRole}",
                accessMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
                //AccessParams accepted in URL for GET method only (ex: /${entity.name.toLowerCase()}/:${entityDtoParameters[0]}, /${entity.name.toLowerCase()}/:${entityDtoParameters[1]} , /${entity.name.toLowerCase()}/:${entityDtoParameters[0]}/:${entityDtoParameters[1]})
                //If request method is GET but request params are not included in the array, the access will be denied
                getAccessParams: ${entityDtoParameters.length > 0 ? `["${entityDtoParameters.join('","')}"]` : `[]`}
            },`
    }

    fileContent +=`\n ])`

    fs.writeFileSync(directoryPath,fileContent)
    console.log(`Generated ${entity.name.toLowerCase()}.access.ts file successfully`);
}