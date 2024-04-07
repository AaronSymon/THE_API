import * as path from 'path';
import * as fs from 'fs';

//Fonction generatePersonalizedControllerTypescriptDocument, permet de générer le fichier de controller personnalisé
//Fucntion generatePersonalizedControllerTypescriptDocument, used to generate the personalized controller file
export default function generatePersonalizedControllerTypescriptDocument (entity: Function) {

    //Déclaration du chemin du fichier
    //File path declaration
    const filePath = path.join(__dirname, `../../../../../src/router/personalizedController/${entity.name.toLowerCase()}.personalizedController.ts`);

    //Déclaration du contenu du fichier
    //File content declaration
    let fileContent: string = `import {${entity.name}} from "../../entity/${entity.name.toLowerCase()}.entity";
import {AppDataSource} from "../../data-source.config";

${entity.name === 'User' ? `

export function FindByEmail(email: string){

    const entityRepository = AppDataSource.getRepository(User);

    return entityRepository.find({
        where : {
            email: email
        }
    })
}


` : ``}
    `;

    //Ecriture du fichier
    //File writing
    fs.writeFileSync(filePath, fileContent)

    console.log(`Generated ${entity.name.toLowerCase()}.personalizedController.ts file successfully`);

}

//Todo: Verifier si la fonction a encore une utilité actuellement