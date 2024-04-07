import {RelationMetadataArgs} from "typeorm/metadata-args/RelationMetadataArgs";
import {getMetadataArgsStorage} from "typeorm";

//Fonction getEntityRelationByType, permet de récupérer les relations d'une entité par type
//Function getEntityRelationByType, allows to get the relations of an entity by type
export function getEntityRelationByType(Entity: Function, relationType : 'one-to-one' |'one-to-many' |'many-to-many'| "many-to-one"): string[] {

    //Récupérer les relations de l'entité
    //Get the relations of the entity
    const relations: RelationMetadataArgs[] = getMetadataArgsStorage().filterRelations(Entity);

    //Créer un tableau vide pour les relations typées
    //Create an empty array for typed relations
    const typedRelations: string[] = [];

    //Parcourir les relations
    //Browse relations
    relations.forEach(relation => {
        //Si la relation est du type demandé, l'ajouter au tableauau tableau
        //If the relation is of the requested type, add it to the array
        if (relation.relationType === relationType){
            typedRelations.push(relation.propertyName)
        }
    });

    //Retourner le tableau des relations typées
    //Return the array of typed relations
    return typedRelations;

}

//Todo: vérifier si cette fonction garde toujours une utilité actuellement car il semblerait qu'elle soit utilisé uniquement dans getEntityDtoValue, mais il faut aussi vérifier si getEntityDtoValue est toujours utilisé