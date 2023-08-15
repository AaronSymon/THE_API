// Importer les modules nécessaires
import { AppDataSource } from "../../data-source.config";
import { getEntityRelation } from "../entities/getEntityRelation";
import { getEntityRelationByType } from "../entities/getEntityRelationByType";
import {searchDto} from "../dtos/searchDto";
import {dtosArray} from "../../array/dtos.array";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";

// Fonction d'update asynchrone prenant en paramètres l'entité, l'id et les données partielles
export default async function update(entity: Function, id: number, datas: Partial<any>) {

        try {
                // Obtenir le référentiel (repository) de l'entité à partir de AppDataSource
                const entityRepository = AppDataSource.getRepository(entity);

                // Récupérer l'ensemble des noms des entités de la relation
                const relations: string[] = getEntityRelation(entity)

                // Vérifier si l'entité est présente en base de données
                const entityToUpdate: Object | null = await entityRepository.findOne({
                        where: { id: id },
                })

                // Si aucune instance de l'entité n'est retournée, sortir de la fonction
                if (!entityToUpdate) {
                        return;
                }

                // Récupérer l'entité avec ses relations en utilisant "relations" pour les jointures
                const entityToUpdateWithRelations: Object | null = await entityRepository.findOne({
                        where: { id: id },
                        relations: relations
                })

                // Mettre à jour les propriétés de l'entité avec les données fournies
                for (const [key, value] of Object.entries(datas)) {
                        entityToUpdate[key] = value
                }

                // Récupérer les relations "one-to-many" de l'entité
                const oneToManyRelations: string[] = getEntityRelationByType(entity, "one-to-many");

                // Si l'entité possède des relations "one-to-many"
                if (oneToManyRelations.length !== 0) {
                        // Pour chacune des relations "one-to-many"
                        for (const oneToManyRelation of oneToManyRelations) {

                                // Vérifier si les données "datas" contiennent des éléments pour cette relation
                                if (datas[oneToManyRelation] !== undefined && datas[oneToManyRelation].length > 0) {

                                        // Pour chaque élément dans la relation "oneToMany"
                                        for (let i = 0; i < datas[oneToManyRelation].length; i++) {

                                                // Si l'élément existe déjà en base de données
                                                if (entityToUpdateWithRelations[oneToManyRelation][i]) {
                                                        // Obtenir le référentiel de l'entité liée à la relation "oneToMany"
                                                        const oneToManyRelationEntityRepository = AppDataSource.getRepository(entityToUpdateWithRelations[oneToManyRelation][i].constructor)

                                                        // Obtenir la clé primaire de l'entité liée
                                                        const primaryKey = oneToManyRelationEntityRepository.getId(entityToUpdateWithRelations[oneToManyRelation][i])

                                                        // Supprimer l'entité liée de la base de données
                                                        await oneToManyRelationEntityRepository.delete(primaryKey)

                                                        // Mettre à jour les propriétés de la clé primaire avec les nouvelles données
                                                        const paramNames = Object.keys(primaryKey)
                                                        //const paramValues = Object.values(primaryKey)

                                                        for (const paramName of paramNames) {
                                                                if (datas[oneToManyRelation][i][paramName] !== undefined && datas[oneToManyRelation][i][paramName] !== null) {
                                                                        if (primaryKey[paramName] !== datas[oneToManyRelation][i][paramName]) {
                                                                                primaryKey[paramName] = datas[oneToManyRelation][i][paramName]
                                                                        }
                                                                }
                                                        }

                                                        // Mettre à jour l'entité liée avec la nouvelle clé primaire
                                                        entityToUpdateWithRelations[oneToManyRelation][i] = primaryKey

                                                        // Vérifier si l'entité liée est déjà présente en base de données
                                                        const isAlreadyInDatabase = await oneToManyRelationEntityRepository.findOneBy(primaryKey)

                                                        // Si elle n'est pas présente, l'ajouter à la base de données
                                                        if (!isAlreadyInDatabase) {
                                                                await oneToManyRelationEntityRepository.save(entityToUpdateWithRelations[oneToManyRelation][i])
                                                        }
                                                }

                                        }

                                }
                        }
                }

                // Enregistrer les modifications de l'entité principale dans la base de données
                await entityRepository.save(entityToUpdate)

                //Rechercher si l'entité possède un DTO pour déterminer les données à renvoyer
                const entityDto: Function | object = searchDto(dtosArray, entity.name)

                //Si l'entité possède un dto
                if (entityDto !== undefined) {
                        //Retourner le dto de l'entité
                        return getEntityDtoValues(entity, entityDto, entityToUpdateWithRelations)

                } else {

                        //Sinon retourner le résultat de la recherche de l'entité supprimer en base de données
                        return entityToUpdateWithRelations;

                }

        } catch (e) {

                // En cas d'erreur, afficher l'erreur dans la console
                //console.log(e)
                return { error: `une erreur est survenue durant la mise à jour de ${entity.name}` }


        }

}
