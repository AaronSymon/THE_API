import * as path from 'path';
import * as fs from 'fs';
import {TheObject} from "../../types";

//Fonction qui génère le fichier cache pour chaque entité
//Function that generates the cache file for each entity
export default function generateTheCache (theObject: TheObject): void {

    const entity = theObject.entity;
    const entityName = entity.entityName;
    const isEntityCached = theObject.cache.isEntityCached;

    //Création du dossier cache s'il n'existe pas
    //Create the cache folder if it does not exist
    const directoryPath = path.join(__dirname, '../../cache');


    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }

    //Chemin du fichier cache
    //Cache file path
    const filePath = path.join(directoryPath, `${entityName}.cache.ts`);

    //Contenu du fichier cache
    //Cache file content
    let fileContent = `import {${entityName.charAt(0).toUpperCase()}${entityName.slice(1)}} from '../entity/${entityName}.entity';
    import {entityCache} from "../types";
    
    export const ${entityName}Cache : entityCache = {
    
        entity : ${entityName.charAt(0).toUpperCase()}${entityName.slice(1)},
        isEntityCached : ${isEntityCached}
    
    }
    `

    //Ecriture du fichier cache
    //Write the cache file
    fs.writeFileSync(filePath, fileContent);
    console.log(`Generated ${entityName}.cache File`);

};