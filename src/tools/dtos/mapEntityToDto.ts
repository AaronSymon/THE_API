/**
 * Map an entity to a DTO instance.
 * @param entity The entity to be mapped.
 * @param DTOClass The DTO class to create an instance of.
 * @returns An instance of the DTO populated with data from the entity.
 */
export function mapEntityToDTO<Entity, DTO>(
    entity: Entity | Entity[],
    DTOClass: new (entity: Entity) => DTO
): DTO | DTO[] {
    if (Array.isArray(entity)) {
        // Si entity est un tableau, mappez chaque élément et renvoyez un tableau de DTOs.
        return entity.map(item => new DTOClass(item));
    } else {
        // Si entity est une entité unique, renvoyez simplement le DTO correspondant.
        return new DTOClass(entity);
    }
}
