import * as path from 'path';
import * as fs from 'fs';
export default function generatePersonalizedControllerTypescriptDocument (entity: Function) {

    //Déclaration du chemin du fichier
    const filePath = path.join(__dirname, `../../../../../src/router/personalizedController/${entity.name.toLowerCase()}.personalizedController.ts`);

    //Déclaration du contenu du fichier
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
export function FindUserAndRelations(): Promise<User[]>{

    const entityRepository = AppDataSource.getRepository(User);

    return entityRepository.find({
        relations : ['users_adresses_mm','users_conversations_mm','sexe','societe']
    })
}

` : ``}
    `;

    fs.writeFileSync(filePath, fileContent)

    console.log(`Generated ${entity.name.toLowerCase()}.personalizedController.ts file successfully`);

}