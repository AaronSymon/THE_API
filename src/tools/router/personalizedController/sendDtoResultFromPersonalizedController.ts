import {searchDto} from "../../dtos/searchDto";
import {dtosArray} from "../../../array/dtos.array";
import {ObjectLiteral} from "typeorm";
import {getEntityDtoValues} from "../../dtos/getEntityDtoValue";

export default async function sendDtoResultFromPersonalizedController(personalizedControllerData: ObjectLiteral | ObjectLiteral[], entity: Function) {

    //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
    const entityDto: Function = searchDto(dtosArray, entity.name)

    if (Array.isArray(personalizedControllerData)){

        if (personalizedControllerData.length === 0){

            //Retourner un message d'erreur
            return {message: ` Aucune instance de ${entity.name} n'existe en base de données`}
        }

        //Déclaration d'un tableau contenant l'ensemble des instances dto à retourner
        const allDto: Function[] = []

        //Pour chacune des instances
        personalizedControllerData.forEach(instanceOfPersonalizedControllerData => {
            //Retourner une instance dto de l'entité et l'insérer dans le tableau
            allDto.push(getEntityDtoValues(entity, entityDto, instanceOfPersonalizedControllerData))
        })
        //Retourner le tableau contenant l'ensemble des instances dto
        return allDto

    } else {

        //Retourner le dto de l'entité
        return getEntityDtoValues(entity, entityDto, personalizedControllerData);

    }

}