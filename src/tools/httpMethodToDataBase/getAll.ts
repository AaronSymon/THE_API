import {AppDataSource} from "../../data-source.config";
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";
import {mapEntityToDTO} from "../dtos/mapEntityToDto";

export default async function getAll<Entity, DTO>(
    entity: Entity,
    entityDtoConstructor: new (entity: Entity) => DTO
): Promise<DTO[]| DTO | {message: string}> {
    try {
        // @ts-ignore
        const entityRepository = AppDataSource.getRepository(entity);
        const all = await entityRepository.find(entity);

        if (!all || all.length === 0) {
            return [];
        }

        return mapEntityToDTO(all, entityDtoConstructor);
    } catch (error) {
        // @ts-ignore
        return { message: `message: An error occurred while trying to get all ${entity.name}` };
    }
}

//Fonction getAll permettant de récupérer toutes les instances d'une entité
//Function getAll allowing to get all instances of an entity
export async function getAlls(entity : Function)  {

    //Exécuter le code contenu dans le bloc try
    //Execute the code contained in the try block
    try {

        //Récupérer le repository de l'entité
        //Get the entity repository
        const entityRepository = AppDataSource.getRepository(entity);

        // @ts-ignore
        //Récupérer toutes les instances de l'entité
        //Get all instances of the entity
        const all =  await entityRepository.find(entity);

        //Si aucune instance de l'entité n'est retournée
        //If no instance of the entity is returned
        if (all === null){

            //Retourner un message d'erreur
            //Return an error message
            return {message: ` No ${entity.name} found `}
        }

        //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
        //Search if the entity has a DTO to determine the data to return
        const entityDto: Function = searchDto(dtosArray, entity.name)

        //Si l'entité possède un dto
        //If the entity has a dto
        if (entityDto !== undefined){
            //Déclaration d'un tableau contenant l'ensemble des instances dto à retourner
            //Declaration of an array containing all the dto instances to be returned
            const allDto: Function[] = []

            //Pour chacune des instances
            //For each of the instances
            all.forEach(instanceOfAll => {
                //Retourner une instance dto de l'entité et l'insérer dans le tableau
                //Return a dto instance of the entity and insert it into the array
                allDto.push(getEntityDtoValues(entity, entityDto, instanceOfAll))
            })
            //Retourner le tableau contenant l'ensemble des instances dto
            //Return the array containing all the dto instances
            return allDto

        //Si l'entité ne possède pas de dto
        //If the entity does not have a dto
        } else {
            //Retourner le résultat de la recherche
            //Return the result of the search
            return all;

        }

//Si une erreur est survenue durant l'exécution du code contenu dans le bloc try
//If an error occurred during the execution of the code contained in the try block
    } catch (e) {

        //console.log(e)
        //Retourner un message d'erreur
        //Return an error message
        return {message: `An error occurred while trying to get all ${entity.name}`}
        
    }
    
}