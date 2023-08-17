//Import path
import * as path from 'path';
//Import fs
import * as fs from 'fs';

//Fonction generateEntityCacheTypescriptDocument, permet de générer un fichier .cache.ts pour chaque entité
//Function generateEntityCacheTypescriptDocument, allows to generate a .cache.ts file for each entity
export default function generateEntityCacheTypescriptDocument(entity: Function) {

    //Définir le chemin du fichier
    //Define the file path
    const filePath = path.join(__dirname, `../../../../src/cache/${entity.name.toLowerCase()}.cache.ts`);

    //Définir le contenu du fichier
    let fileContent: string = ''

    fileContent += `//Import ${entity.name.toLowerCase()}
    import {${entity.name}} from \'../entity/${entity.name.toLowerCase()}.entity\';\n\n`;

    fileContent += `//${entity.name.toLowerCase()}Cache document, par défault ${entity.name} n'est pas mis en cache
    //${entity.name.toLowerCase()}Cache document, by default ${entity.name} is not cached
    export const ${entity.name.toLowerCase()}Cache : entityCache = {

    entity : ${entity.name},
    //Mettre la valeur de isEntityCached à true pour mettre en cache l'entité ${entity.name}
    //Set the value of isEntityCached to true to cache the ${entity.name} entity
    isEntityCached : false
}`

    //Ecrire le contenu dans le fichier
    //Write the content in the file
    fs.writeFileSync(filePath, fileContent);

    console.log(`Generated ${entity.name.toLowerCase()}.cache.ts file successfully`);

}