import {mapEntityToDTO} from "../dtos/mapEntityToDto";
import {AppDataSource} from "../../data-source.config";

export default async function getEntityAndAccessRelation<Entity, DTO>(
    entity: Entity,
    accessRelationName: string,
    entityDtoConstructor: new (entity: Entity) => DTO
): Promise<DTO[] | DTO | { message: string }> {

    try {

        // @ts-ignore
        const entityRepository = AppDataSource.getRepository(entity);
        const entityInstance = await entityRepository.find({relations: [accessRelationName]});

        if (entityInstance.length === 0) {
            // @ts-ignore
            return {message: `${entity.name} not found with associated ${accessRelationName}`};
        }

        return mapEntityToDTO(entityInstance, entityDtoConstructor);

    } catch (error) {

        // @ts-ignore
        return {message: `An error occurred while trying to get ${entity.name} and associated ${accessRelationName}`}
    }
}