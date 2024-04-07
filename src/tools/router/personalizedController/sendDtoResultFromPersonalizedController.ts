import {searchDto} from "../../dtos/searchDto";
import {dtosArray} from "../../../array/dtos.array";
import {ObjectLiteral} from "typeorm";
import {getEntityDtoValues} from "../../dtos/getEntityDtoValue";

//Fonction sendDtoResultFromPersonalizedController, permettant de retourner les données d'un controller personnalisé
//Function sendDtoResultFromPersonalizedController, used to return data from a personalized controller
export default async function sendDtoResultFromPersonalizedController(personalizedControllerData: ObjectLiteral | ObjectLiteral[], entity: Function) {

    //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
    //Search if the entity has a DTO to determine the data to return
    const entityDto: Function = searchDto(dtosArray, entity.name)

    //Si le controller personnalisé retourne un tableau
    //If the personalized controller returns an array
    if (Array.isArray(personalizedControllerData)){

        //Si le tableau est vide
        //If the array is empty
        if (personalizedControllerData.length === 0){

            //Retourner un message d'erreur
            //Return an error message
            return {message: ` Aucune instance de ${entity.name} n'existe en base de données`}
        }

        //Déclaration d'un tableau contenant l'ensemble des instances dto à retourner
        //Declaration of an array containing all the dto instances to be returned
        const allDto: Function[] = []

        //Pour chacune des instances
        //For each instances
        personalizedControllerData.forEach(instanceOfPersonalizedControllerData => {
            //Retourner une instance dto de l'entité et l'insérer dans le tableau
            //Return an entity dto instance and insert it into the array
            allDto.push(getEntityDtoValues(entity, entityDto, instanceOfPersonalizedControllerData))
        })
        //Retourner le tableau contenant l'ensemble des instances dto
        //Return the array containing all the dto instances
        return allDto

    //Si le controller personnalisé retourne une instance
    //If the personalized controller returns an instance
    } else {

        //Retourner le dto de l'entité
        //Return the entity dto
        return getEntityDtoValues(entity, entityDto, personalizedControllerData);

    }

}

//Todo : Vérifier si la fonction à encore une utilité actuellement