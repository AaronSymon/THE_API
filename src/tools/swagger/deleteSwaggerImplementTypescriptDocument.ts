import * as path from 'path';
import * as fs from 'fs'

export default function deleteSwaggerImplementTypescriptDocument(entity: Function) {

    const directoryPath = path.join(__dirname, `../../../../src/tools/swagger/swaggerImplement/${entity.name}.swaggerImplement.ts`);

    // Supprimer le fichier existant s'il y en a un
    if (fs.existsSync(directoryPath)) {
        fs.unlinkSync(directoryPath);
    }

};