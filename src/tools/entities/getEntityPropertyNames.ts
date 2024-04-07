//Import TypeORM
import {getMetadataArgsStorage} from "typeorm";
import {RelationMetadataArgs} from "typeorm/metadata-args/RelationMetadataArgs";
import {ColumnMetadataArgs} from "typeorm/metadata-args/ColumnMetadataArgs";

//Focntion getEntityPropertiesName, prend en paramètre une entité et retourne un tableau de string contenant les noms des propriétés de l'entité
//Function getEntityPropertiesName, takes an entity as a parameter and returns a string array containing the names of the entity's properties
export function getEntityPropertiesName(Entity: Function): string[] {

    //Récupérer les colonnes et les relations de l'entité
    //Get the columns and relations of the entity
    const columns : ColumnMetadataArgs[] = getMetadataArgsStorage().filterColumns(Entity);
    const relations: RelationMetadataArgs[] = getMetadataArgsStorage().filterRelations(Entity)

    //Créer un tableau contenant les noms des colonnes et des relations
    //Create an array containing the names of the columns and relations
    const columnNames = columns.map(column => column.propertyName)
    const relationNames = relations.map(relation => relation.propertyName)

    //Retourner le tableau de noms de colonnes et de relations
    return [...columnNames,...relationNames]
}

//Todo: vérifier si cette fonction garde toujours une utilité actuellement