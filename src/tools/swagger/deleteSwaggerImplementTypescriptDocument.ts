import * as path from 'path';
import * as fs from 'fs'

//Fonction deleteSwaggerImplementTypescriptDocument, permet de supprimer le fichier swaggerImplement.ts
//Function deleteSwaggerImplementTypescriptDocument, allows to delete the swaggerImplement.ts file
export default function deleteSwaggerImplementTypescriptDocument(entity: Function) {

    // Définir le chemin du fichier
    // Define the file path
    const directoryPath = path.join(__dirname, `../../../../src/tools/swagger/swaggerImplement/${entity.name}.swaggerImplement.ts`);

    // Supprimer le fichier existant s'il y en a un
    // Delete the existing file if there is one
    if (fs.existsSync(directoryPath)) {
        fs.unlinkSync(directoryPath);
    }

};