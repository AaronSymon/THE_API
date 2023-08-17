//Import path
import * as path from 'path';

//Import fs
import * as fs from 'fs';

//Import users roles
import {userRoles} from "../../access/userRoles/userRoles";

//Import dtos
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";

//Import getFunctionParams
import {getFunctionParams} from "../functions/getFunctionParams";

//Fonction permettant de générer un document typescript contenant les informations d'accès aux différentes méthodes de l'API pour une entité donnée
//Function for generating a typescript document containing access information to the different methods of the API for a given entity
export default function generateEntityAccessTypescriptDocument (entity: Function) {

    //Définir le répertoire dans lequel sera enregistré le document typescript ainsi que le nom du document
    //Define the directory in which the typescript document will be saved as well as the name of the document
    const directoryPath = path.join(__dirname, `../../../../src/access/${entity.name.toLowerCase()}.access.ts`);

    //Récupérer les paramètres du DTO de l'entité
    //Get the parameters of the entity DTO
    const entityDtoParameters = getFunctionParams(searchDto(dtosArray, `${entity.name}`))

    //Générer le contenu du document typescript
    //Generate the content of the typescript document
    let fileContent : string = ``

    fileContent += `//${entity.name.toLowerCase()}Access document, pour chacun des types d'utilisateur, supprimer les méthodes d'accès HTTP non autorisées ainsi que les params des méthodes GET non autorisés
//${entity.name.toLowerCase()}Access document, for each user type, delete unauthorized HTTP access methods and unauthorized GET method params
export const ${entity.name.toLowerCase()}Access : Set<entityAccess> = new Set([`

    //Pour chacun des types d'utilisateur, ajouter un objet contenant les méthodes d'accès HTTP GET, POST, PUT, DELETE ainsi que les params des méthodes GET basés sur le DTO de l'entité
    //For each user type, add an object containing the HTTP access methods GET, POST, PUT, DELETE as well as the GET method params based on the entity DTO
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

    //Enregistrer le document typescript dans le répertoire défini précédemment
    //Save the typescript document in the directory defined previously
    fs.writeFileSync(directoryPath,fileContent)

    console.log(`Generated ${entity.name.toLowerCase()}.access.ts file successfully`);
}