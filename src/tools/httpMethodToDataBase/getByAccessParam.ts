import {AppDataSource} from "../../data-source.config";
import {mapEntityToDTO} from "../dtos/mapEntityToDto";

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
            return { message: `${entity.name} with param ${accessParamName} ${accessParamValue} not found` };
        }

        return mapEntityToDTO(entityInstance, entityDtoConstructor);

    } catch (error) {
        // @ts-ignore
        return {message: `An error occurred while trying to get ${entity.name} with param ${accessParamName} ${accessParamValue}`};
    }

}