import {AppDataSource} from "../../data-source.config";
import {getEntityRelation} from "../entities/getEntityRelation";
import {getEntityRelationByType} from "../entities/getEntityRelationByType";
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";


//Fonction deleteOne, permet de supprimer une entité en base de données
//Fucntion deleteOne, allow to delete one entity into database
export default async function deleteOne(entity: Function, id: number) {

        //Exécuter le code contenu dans le try
        //Execute try's content
        try {

                //Récupérer le repository de l'entité
                //Get entity repository
                const entityRepository = AppDataSource.getRepository(entity);

                //Récupérer l'ensemble des entités de la relation
                //Get all entities of the relation
                const relations: string[] = getEntityRelation(entity)

                //Verifier si l'entité est présente en base de données
                //Check if entity is present into database
                const entityToDelete: Object | null = await entityRepository.findOne({
                        where: {id: id},
                        relations: relations
                })

                //Si aucune instance de l'entité n'est retournée
                //If any instance of the entity is returned
                if (!entityToDelete) {

                        //Retourner un message d'erreur
                        //Return error message
                        return {message: ` Id : ${id} not found. Can't delete ${entity.name}`};

                }

                //Récupérer les relations oneToMany de l'entité
                //Get oneToMany relations of the entity
                const oneToManyRelations: string[] = getEntityRelationByType(entity, "one-to-many");

                //Si l'entité possède des relations oneToMany
                //If entity has oneToMany relations
                if (oneToManyRelations.length !== 0) {
                        //Pour chacune des relations oneToMany
                        //For each oneToMany relations
                        for (const oneToManyRelation of oneToManyRelations) {
                                //Pour chacune des entités de relation oneToMany
                                //For each oneToMany relation entities
                                for (const oneToManyRelationEntity of entityToDelete[oneToManyRelation]) {

                                        //Récupérer le repository de l'entité de relation oneToMany
                                        //Get oneToMany relation entity repository
                                        const oneToManyRelationEntityRepository = AppDataSource.getRepository(oneToManyRelationEntity.constructor)

                                        //Récupérer les clés primaires de l'entité de relation oneToMany
                                        //Get oneToMany relation entity primary keys
                                        Object.keys(oneToManyRelationEntity);
                                        const primaryKey = oneToManyRelationEntityRepository.getId(oneToManyRelationEntity)

                                        //Supprimer l'entité de relation oneToMany en base de données
                                        //Delete oneToMany relation entity into database
                                        await oneToManyRelationEntityRepository.delete(primaryKey)
                                }
                        }
                }


                //Delete entity into database
                //Supprimer l'entité en base de données
                await entityRepository.delete(id)

                //Récupérer l'ensemble des relations oneToOne de l'entité
                //Get all oneToOne relations of the entity
                const oneToOneRelations: string[] = getEntityRelationByType(entity, "one-to-one");

                //Si l'entité possède des relations oneToOne
                //If entity has oneToOne relations
                if (oneToOneRelations.length !== 0) {
                        //Pour chacune des relations oneToOne  de l'entité
                        //For each oneToOne relations of the entity
                        for (const oneToOneRelation of oneToOneRelations) {
                                //Récupérer l'entité de la relation oneToOne
                                //Get oneToOne relation entity
                                const oneToOneRelationEntity = entityToDelete[oneToOneRelation]

                                //Récupérer le repository de l'entité de la relation oneToOne
                                //Get oneToOne relation entity repository
                                const oneToOneRelationEntityRepository = AppDataSource.getRepository(oneToOneRelationEntity.constructor)

                                //Supprimer l'entité de la relation oneToOne en base de données
                                //Delete oneToOne relation entity into database
                                await oneToOneRelationEntityRepository.delete(oneToOneRelationEntity.id)
                        }
                }

                //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
                //Search if entity has a DTO to determine data to return
                const entityDto: Function | object = searchDto(dtosArray, entity.name)

                //Si l'entité possède un dto
                //If entity has a dto
                if (entityDto !== undefined) {
                        //@ts-ignore
                        //Retourner le dto de l'entité
                        //Return entity dto
                        return getEntityDtoValues(entity, entityDto, entityToDelete)

                } else {

                        //Sinon retourner le résultat de la recherche de l'entité supprimer en base de données
                        //Else return result of the search of the deleted entity into database
                        return entityToDelete;

                }
        } catch (e) {

                    //console.log(e)
                    return {message: `An error occured while deleting ${entity.name}`}
        }
}