import {getMetadataArgsStorage} from "typeorm";
import {RelationMetadataArgs} from "typeorm/metadata-args/RelationMetadataArgs";
import {ColumnMetadataArgs} from "typeorm/metadata-args/ColumnMetadataArgs";

export function getEntityPropertiesName(Entity: Function): string[] {
    const columns : ColumnMetadataArgs[] = getMetadataArgsStorage().filterColumns(Entity);
    const relations: RelationMetadataArgs[] = getMetadataArgsStorage().filterRelations(Entity)

    const columnNames = columns.map(column => column.propertyName)
    const relationNames = relations.map(relation => relation.propertyName)

    return [...columnNames,...relationNames]
}