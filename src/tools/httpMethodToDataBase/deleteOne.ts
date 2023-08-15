import {AppDataSource} from "../../data-source.config";
import {getEntityRelation} from "../entities/getEntityRelation";
import {getEntityRelationByType} from "../entities/getEntityRelationByType";
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";

export default async function deleteOne(entity: Function, id: number) {

        try {
                const entityRepository = AppDataSource.getRepository(entity);

                //Récupérer l'ensemble des entités de la relation
                const relations: string[] = getEntityRelation(entity)

                //Verifier si l'entité est présente en base de données
                const entityToDelete: Object | null = await entityRepository.findOne({
                        where: {id: id},
                        relations: relations
                })

                //Si aucune instance de l'entité n'est retournée
                if (!entityToDelete) {

                        //Détruire la connexion à la base de données
                        // await connection.destroy()
                        //Retourner un message d'erreur
                        return {error: ` Id : ${id} introuvable. Impossible de supprimer ${entity.name}`};

                }

                //Récupérer les relations oneToMany de l'entité
                const oneToManyRelations: string[] = getEntityRelationByType(entity, "one-to-many");

                //Si l'entité possède des relations oneToMany
                if (oneToManyRelations.length !== 0) {
                        //Pour chacune des relations oneToMany
                        for (const oneToManyRelation of oneToManyRelations) {
                                //Pour chacune des entités de relation oneToMany
                                for (const oneToManyRelationEntity of entityToDelete[oneToManyRelation]) {
                                        const oneToManyRelationEntityRepository = AppDataSource.getRepository(oneToManyRelationEntity.constructor)
                                        const paramNames = Object.keys(oneToManyRelationEntity)

                                        const primaryKey = oneToManyRelationEntityRepository.getId(oneToManyRelationEntity)

                                        await oneToManyRelationEntityRepository.delete(primaryKey)
                                }
                        }
                }


                //Delete entity into database
                await entityRepository.delete(id)

                //Récupérer l'ensemble des relations oneToOne de l'entité
                const oneToOneRelations: string[] = getEntityRelationByType(entity, "one-to-one");

                //Si l'entité possède des relations oneToOne
                if (oneToOneRelations.length !== 0) {
                        //Pour chacune des relations oneToOne  de l'entité
                        for (const oneToOneRelation of oneToOneRelations) {
                                //Récupérer l'entité de la relation oneToOne
                                const oneToOneRelationEntity = entityToDelete[oneToOneRelation]

                                const oneToOneRelationEntityRepository = AppDataSource.getRepository(oneToOneRelationEntity.constructor)

                                //Supprimer l'entité de la relation oneToOne en base de données
                                await oneToOneRelationEntityRepository.delete(oneToOneRelationEntity.id)
                        }
                }

                //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
                const entityDto: Function | object = searchDto(dtosArray, entity.name)

                //Si l'entité possède un dto
                if (entityDto !== undefined) {
                        //Retourner le dto de l'entité
                        return getEntityDtoValues(entity, entityDto, entityToDelete)

                } else {

                        //Sinon retourner le résultat de la recherche de l'entité supprimer en base de données
                        return entityToDelete;

                }
        } catch (e) {

                    //console.log(e)
                    return {error: ` Une erreur est survenue durant la suppresion de ${entity.name}`}
        }
}