import {AppDataSource} from "../../data-source.config";
import {dtosArray} from "../../array/dtos.array";
import {searchEntityDto} from "../dtos/searchEntityDto";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";
import {mapEntityToDTO} from "../dtos/mapEntityToDto";

export default async function getOne<Entity, DTO>(
    entity: Entity,
    entityId: number,
    entityDtoConstructor: new (entity: Entity) => DTO
): Promise<DTO[]| DTO | {message: string}> {
    try {
        // @ts-ignore
        const entityRepository = AppDataSource.getRepository(entity);
        const entityInstance = await entityRepository.findOne({ where: { id: entityId } });

        if (!entityInstance) {
            // @ts-ignore
            return { message: `${entity.name} with ID ${entityId} not found` };
        }

        return mapEntityToDTO(entityInstance, entityDtoConstructor);
    } catch (error) {
        // @ts-ignore
        return { message: `An error occurred while trying to get ${entity.name} with ID ${entityId}` };
    }
}

//Fonction getOne, permet de récupérer une entité par son id
//getOne function, allows to retrieve an entity by its id
export  async function getOnes(entity: Function, id: number) {

    //Exécuter le code contenu dans le bloc try
    //Execute the code contained in the try block
    try {

        //Récupérer le repository de l'entité
        //Get the entity repository
        const entityRepository = AppDataSource.getRepository(entity);

        //Récupérer l'entité ayant pour id celui passé en paramètre
        //Get the entity with the id passed as a parameter
        const One = await entityRepository.findOne({where: {id: id}});

        //Récupérer le dto de l'entité
        //Get the entity dto
        const entityDto = searchEntityDto(dtosArray, entity.name);

        //Si l'entité possède un dto
        //If the entity has a dto
        if (entityDto !== undefined) {

            //Retourner le dto de l'entité
            //Return the entity dto
            return getEntityDtoValues(entity, entityDto, One);

        } else {

            //Sinon retourner le résultat de la recherche
            //Else return the search result
            return One;

        }

    //Si une erreur est survenue durant l'exécution du bloc try, exécuter le bloc catch
    //If an error occurred during the execution of the try block, execute the catch block
    } catch (e) {

        //console.log(e)
        //Retourner une erreur
        //Return an error
        return {message: `An error occurred while searching for the ${entity.name} with the id ${id}`}

    }

}