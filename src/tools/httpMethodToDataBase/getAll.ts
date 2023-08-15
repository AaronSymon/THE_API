import {AppDataSource} from "../../data-source.config";
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";

export default async function getAll(entity : Function)  {

    try {

        const entityRepository = AppDataSource.getRepository(entity);

        // @ts-ignore
        const all =  await entityRepository.find(entity);

        //Si aucune instance de l'entité n'est retournée
        if (all === null){

            //Retourner un message d'erreur
            return {error: ` Aucune instance de ${entity.name} n'existe en base de données`}
        }

        //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
        const entityDto: Function = searchDto(dtosArray, entity.name)

        //Si l'entité possède un dto
        if (entityDto !== undefined){
            //Déclaration d'un tableau contenant l'ensemble des instances dto à retourner
            const allDto: Function[] = []

            //Pour chacune des instances
            all.forEach(instanceOfAll => {
                //Retourner une instance dto de l'entité et l'insérer dans le tableau
                allDto.push(getEntityDtoValues(entity, entityDto, instanceOfAll))
            })
            //Retourner le tableau contenant l'ensemble des instances dto
            return allDto

        } else {
            //Sinon retourner le résultat de la recherche
            return all;

        }

    } catch (e) {

        //console.log(e)
        return {error: `une erreur est survenue durant la récupération de toutes les instances de ${entity.name}`}
        
    }
    
}