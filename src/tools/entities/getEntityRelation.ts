//Import TypeORM
import {RelationMetadataArgs} from "typeorm/metadata-args/RelationMetadataArgs";
import {getMetadataArgsStorage} from "typeorm";

//Fonction getEntityRelation, permet de récupérer les relations d'une entité
//Function getEntityRelation, allows to get the relations of an entity
export function getEntityRelation(Entity: Function): string[] {

    //Récupérer les relations de l'entité
    //Get the relations of the entity
    const relations: RelationMetadataArgs[] = getMetadataArgsStorage().filterRelations(Entity)

    //Récupérer les noms des relations
    //Get the names of the relations
    return relations.map(relation => relation.propertyName)
}

//Todo: vérifier si cette fonction garde toujours une utilité actuellement