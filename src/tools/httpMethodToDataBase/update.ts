// Importer les modules nécessaires
import { AppDataSource } from "../../data-source.config";
import { getEntityRelation } from "../entities/getEntityRelation";
import { getEntityRelationByType } from "../entities/getEntityRelationByType";
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";
import {mapEntityToDTO} from "../dtos/mapEntityToDto";

export default async function update<Entity, DTO>(
    entity: Entity,
    entityId: number,
    updateData: Partial<Entity>,
    entityDtoConstructor: new (entity: Entity) => DTO
): Promise<DTO[]| DTO | {message: string}> {
        try {
                // @ts-ignore
                const entityRepository = AppDataSource.getRepository(entity);
                const existingEntity = await entityRepository.findOne({where: {id: entityId}});

                if (!existingEntity) {
                        // @ts-ignore
                        return { message: `${entity.name} with ID ${entityId} not found` };
                }

                Object.assign(existingEntity, updateData);
                const updatedEntity = await entityRepository.save(existingEntity);

                return mapEntityToDTO(updatedEntity, entityDtoConstructor);
        } catch (error) {
                // @ts-ignore
                return { message: `An error occurred while trying to update ${entity.name} with ID ${entityId}` };
        }
}

//Fonction update, permet de mettre à jour une entité en base de données
//Function update, allows to update an entity in the database
export async function updates(entity: Function, id: number, datas: Partial<any>) {

        //Exécuter le code contenu dans le bloc try
        //Execute the code contained in the try block
        try {

                //Récupérer le repository de l'entité
                //Get the repository of the entity
                const entityRepository = AppDataSource.getRepository(entity);

                //Récupérer les relations de l'entité
                //Get the relations of the entity
                const relations: string[] = getEntityRelation(entity)

                // Vérifier si l'entité est présente en base de données
                // Check if the entity is present in the database
                const entityToUpdate: Object | null = await entityRepository.findOne({
                        where: { id: id },
                })

                // Si aucune instance de l'entité n'est retournée, sortir de la fonction
                // If no instance of the entity is returned, exit the function
                if (!entityToUpdate) {
                        return;
                }

                // Récupérer l'entité avec ses relations en utilisant "relations" pour les jointures
                // Get the entity with its relations using "relations" for the joins
                const entityToUpdateWithRelations: Object | null = await entityRepository.findOne({
                        where: { id: id },
                        relations: relations
                })

                // Mettre à jour les propriétés de l'entité avec les données fournies
                // Update the properties of the entity with the provided data
                for (const [key, value] of Object.entries(datas)) {
                        entityToUpdate[key] = value
                }

                // Récupérer les relations "one-to-many" de l'entité
                // Get the "one-to-many" relations of the entity
                const oneToManyRelations: string[] = getEntityRelationByType(entity, "one-to-many");

                // Si l'entité possède des relations "one-to-many"
                // If the entity has "one-to-many" relations
                if (oneToManyRelations.length !== 0) {
                        // Pour chacune des relations "one-to-many"
                        // For each of the "one-to-many" relations
                        for (const oneToManyRelation of oneToManyRelations) {

                                // Vérifier si les données "datas" contiennent des éléments pour cette relation
                                // Check if the "datas" data contains elements for this relation
                                if (datas[oneToManyRelation] !== undefined && datas[oneToManyRelation].length > 0) {

                                        // Pour chaque élément dans la relation "oneToMany"
                                        // For each element in the "oneToMany" relation
                                        for (let i = 0; i < datas[oneToManyRelation].length; i++) {

                                                // Si l'élément existe déjà en base de données
                                                // If the element already exists in the database
                                                if (entityToUpdateWithRelations[oneToManyRelation][i]) {
                                                        // Obtenir le référentiel de l'entité liée à la relation "oneToMany"
                                                        // Get the repository of the entity linked to the "oneToMany" relation
                                                        const oneToManyRelationEntityRepository = AppDataSource.getRepository(entityToUpdateWithRelations[oneToManyRelation][i].constructor)

                                                        // Obtenir la clé primaire de l'entité liée
                                                        // Get the primary key of the linked entity
                                                        const primaryKey = oneToManyRelationEntityRepository.getId(entityToUpdateWithRelations[oneToManyRelation][i])

                                                        // Supprimer l'entité liée de la base de données
                                                        // Delete the linked entity from the database
                                                        await oneToManyRelationEntityRepository.delete(primaryKey)

                                                        // Mettre à jour les propriétés de la clé primaire avec les nouvelles données
                                                        // Update the properties of the primary key with the new data
                                                        const paramNames = Object.keys(primaryKey)
                                                        //const paramValues = Object.values(primaryKey)

                                                        // Pour chaque paramètre de la clé primaire
                                                        // For each parameter of the primary key
                                                        for (const paramName of paramNames) {
                                                                if (datas[oneToManyRelation][i][paramName] !== undefined && datas[oneToManyRelation][i][paramName] !== null) {
                                                                        if (primaryKey[paramName] !== datas[oneToManyRelation][i][paramName]) {
                                                                                primaryKey[paramName] = datas[oneToManyRelation][i][paramName]
                                                                        }
                                                                }
                                                        }

                                                        // Mettre à jour l'entité liée avec la nouvelle clé primaire
                                                        // Update the linked entity with the new primary key
                                                        entityToUpdateWithRelations[oneToManyRelation][i] = primaryKey

                                                        // Vérifier si l'entité liée est déjà présente en base de données
                                                        // Check if the linked entity is already present in the database
                                                        const isAlreadyInDatabase = await oneToManyRelationEntityRepository.findOneBy(primaryKey)

                                                        // Si elle n'est pas présente, l'ajouter à la base de données
                                                        // If it is not present, add it to the database
                                                        if (!isAlreadyInDatabase) {
                                                                await oneToManyRelationEntityRepository.save(entityToUpdateWithRelations[oneToManyRelation][i])
                                                        }
                                                }

                                        }

                                }
                        }
                }

                // Enregistrer les modifications de l'entité principale dans la base de données
                // Save the changes of the main entity in the database
                await entityRepository.save(entityToUpdate)

                //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
                //Search if the entity has a DTO to determine the data to return
                const entityDto: Function | object = searchDto(dtosArray, entity.name)

                //Si l'entité possède un dto
                //If the entity has a dto
                if (entityDto !== undefined) {
                        //@ts-ignore
                        //Retourner le dto de l'entité
                        //Return the entity dto
                        return getEntityDtoValues(entity, entityDto, entityToUpdateWithRelations)

                } else {

                        //Sinon retourner le résultat de la recherche de l'entité supprimer en base de données
                        //Else return the result of the search for the entity to delete in the database
                        return entityToUpdateWithRelations;

                }

        //Exécuter le code contenu dans le bloc catch si une erreur est survenue
        //Execute the code contained in the catch block if an error occurred
        } catch (e) {

                //console.log(e)
                //Retourner un message d'erreur
                //Return an error message
                return { message: `une erreur est survenue durant la mise à jour de ${entity.name}` }


        }

}
