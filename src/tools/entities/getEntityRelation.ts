import {RelationMetadataArgs} from "typeorm/metadata-args/RelationMetadataArgs";
import {getMetadataArgsStorage} from "typeorm";

export function getEntityRelation(Entity: Function): string[] {

    const relations: RelationMetadataArgs[] = getMetadataArgsStorage().filterRelations(Entity)

    return relations.map(relation => relation.propertyName)
}