import {RelationMetadataArgs} from "typeorm/metadata-args/RelationMetadataArgs";
import {getMetadataArgsStorage} from "typeorm";

export function getEntityRelationByType(Entity: Function, relationType : 'one-to-one' |'one-to-many' |'many-to-many'| "many-to-one"): string[] {

    const relations: RelationMetadataArgs[] = getMetadataArgsStorage().filterRelations(Entity);
    const typedRelations: string[] = [];

    relations.forEach(relation => {
        if (relation.relationType === relationType){
            typedRelations.push(relation.propertyName)
        }
    });

    return typedRelations;

}