import {AppDataSource} from "../../data-source.config";
import {ObjectLiteral, Repository} from "typeorm";

/**
 * Insert an entity in the database.
 * @param entity - The entity to insert.
 * @param data - The data to insert.
 * @return The inserted entity
 * @return An error message
 */
export default async function insert(entity: Function, data: Partial<any>) : Promise<ObjectLiteral | {message: string}> {

    //Exécuter le code contenu dans le bloc try
    //Execute the code contained in the try block
    try {

        //Récupérer le repository de l'entité
        //Get the repository of the entity
        const entityRepository : Repository<ObjectLiteral> = AppDataSource.getRepository(entity);

        //Créer une instance de l'entité
        //Create an instance of the entity
        let entityInstance : ObjectLiteral = entityRepository.create(data);

        //Sauvegarder l'instance de l'entité dans la base de données
        //Save the entity instance in the database
        return await entityRepository.save(entityInstance)

    //Si une erreur est survenue durant l'exécution du bloc try, exécuter le code contenu dans le bloc catch
    //If an error occurred during the execution of the try block, execute the code contained in the catch block
    } catch (e) {

        //console.log(e);

        //Retourner un message d'erreur
        //Return an error message
        return {message: `an error occurred while inserting ${entity.name}`}

    }

}