import {AppDataSource} from "../../data-source.config";
import {mapEntityToDTO} from "../dtos/mapEntityToDto";

/**
 * Get an entity by an access parameter (id, email, etc.)
 * @param entity - The entity to get.
 * @param accessParamName - The name of the access parameter.
 * @param accessParamValue - The value of the access parameter.
 * @param entityDtoConstructor - The DTO constructor.
 * @return An Array of DTOs populated with the entity data
 * @return A DTO populated with the entity data
 * @return An error message
 */
export default async function getByAccessParam<Entity, DTO>(
    entity: Entity,
    accessParamName: string,
    accessParamValue: string,
    entityDtoConstructor: new (entity: Entity) => DTO
): Promise<DTO[]| DTO | {message: string}> {

    try {
        // @ts-ignore
        const entityRepository = AppDataSource.getRepository(entity);
        const whereClause = {[accessParamName]: accessParamValue};
        const entityInstance = await entityRepository.findOne({where: whereClause});

        if (!entityInstance) {
            // @ts-ignore
            return { message: `${entity.name} with param ${accessParamName} = ${accessParamValue} not found` };
        }

        return mapEntityToDTO(entityInstance, entityDtoConstructor);

    } catch (error) {
        // @ts-ignore
        return {message: `An error occurred while trying to get ${entity.name} with param ${accessParamName} = ${accessParamValue}`};
    }

}

//Todo : prise en charge de plusieurs paramètres d'accès