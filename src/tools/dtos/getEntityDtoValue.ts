import {dtosArray} from "../../array/dtos.array";
import {searchDto} from "./searchDto";
import {getFunctionParams} from "../functions/getFunctionParams";
import {getEntityRelationByType} from "../entities/getEntityRelationByType";

//Fonction qui permet de récupérer les valeurs d'un DTO d'une entité
//Function that allows to get the values of an entity DTO
export function getEntityDtoValues(entity: Function, entityDto: Function, entityResults: unknown): Function {

    //Récupérer les paramètres que prend le DTO, ils correspondent aux données de l'entité à renvoyer
    //Get the parameters that the DTO takes, they correspond to the data of the entity to be returned
    const paramNames = getFunctionParams(entityDto)

    //Attribuer à chacun des paramètres la valeur de l'entité à renvoyer
    //Assign to each of the parameters the value of the entity to be returned
    const paramValues :string[] = paramNames.map( paramName => entityResults[paramName])

    // @ts-ignore
    //Déclarer une nouvelle instance du DTO de l'entité et lui passer les valeurs à retourner
    //Declare a new instance of the entity DTO and pass it the values to return
    const dtoValues : typeof entityDto = new entityDto(...paramValues)

    //Récupérer les relations many-to-many, many-to-one, one-to-many et one-to-one de l'entité
    //Get the many-to-many, many-to-one, one-to-many and one-to-one relations of the entity
    const manyToManyRelations : string[] = getEntityRelationByType(entity,"many-to-many");
    const manyToOneRelations : string[] = getEntityRelationByType(entity,"many-to-one");
    const oneToManyRelations : string[] = getEntityRelationByType(entity, "one-to-many");
    const oneToOneRelations : string[] = getEntityRelationByType(entity,"one-to-one");

    //Si l'entité possède des relations many-to-one
    //If the entity has many-to-one relationships
    if (manyToManyRelations.length !== 0){

        //Pour chacune des relations many-to-many
        //For each of the many-to-many relationships
        manyToManyRelations.forEach(manyToManyRelation => {

            //Si la relation many-to-many de entityResult est définie et qu'elle n'est pas vide
            //If the many-to-many relationship of entityResult is defined and not empty
            if (entityResults[manyToManyRelation] !== undefined && entityResults[manyToManyRelation].length !== 0){

                //Récupérer le nom de l'entité de la relation many-to-many
                //Get the name of the many-to-many relationship entity
                const manyToManyRelationEntity: string = entityResults[manyToManyRelation][0].constructor.name

                //Récupérer le DTO de l'entité de la relation many-to-many
                //Get the DTO of the many-to-many relationship entity
                const manyToManyRelationEntityDto = searchDto(dtosArray, manyToManyRelationEntity)

                //Si le DTO de l'entité de la relation many-to-many est défini
                if (manyToManyRelationEntityDto !== undefined){

                    //Récupérer les paramètres que prend le DTO de l'entité de la relation many-to-many
                    //Get the parameters that the DTO of the many-to-many relationship entity takes
                    const manyToManyRelationParamNames = getFunctionParams(manyToManyRelationEntityDto)

                    //Déclarer un tableau qui contiendra les valeurs du DTO de l'entité de la relation many-to-many
                    //Declare an array that will contain the values of the DTO of the many-to-many relationship entity
                    const manyToManyRelationValues : typeof manyToManyRelationEntityDto[] = []

                    //Pour chacune des données de la relation many-to-many
                    //For each of the many-to-many relationship data
                    dtoValues[manyToManyRelation].forEach(manyToManyRelationData => {

                        //Récupérer les valeurs de chacun des paramètres du DTO de l'entité de la relation many-to-many
                        //Get the values of each of the parameters of the DTO of the many-to-many relationship entity
                        const manyToManyRelationParamValues = manyToManyRelationParamNames.map(manyToManyRelationParamName => manyToManyRelationData[manyToManyRelationParamName])

                        // @ts-ignore
                        //Déclarer une nouvelle instance du DTO de l'entité de la relation many-to-many et lui passer les valeurs à retourner
                        //Declare a new instance of the DTO of the many-to-many relationship entity and pass it the values to return
                        const manyToManyRelationDtoData : typeof manyToManyRelationEntityDto = new manyToManyRelationEntityDto(...manyToManyRelationParamValues)

                        //Ajouter les valeurs du DTO de l'entité de la relation many-to-many au tableau
                        //Add the values of the DTO of the many-to-many relationship entity to the array
                        manyToManyRelationValues.push(manyToManyRelationDtoData);
                    })

                    //Assigner les valeurs du tableau au DTO de l'entité de la relation many-to-many
                    //Assign the values of the array to the DTO of the many-to-many relationship entity
                    dtoValues[manyToManyRelation] = manyToManyRelationValues
                }

            }

        })
    }

    //Si l'entité possède des relations many-to-one
    //If the entity has many-to-one relationships
    if (manyToOneRelations.length !== 0){

        //Pour chacune des relations many-to-one
        //For each of the many-to-one relationships
        manyToOneRelations.forEach(manyToOneRelation => {

            //Si la relation many-to-one de entityResult est définie et qu'elle n'est pas vide
            //If the many-to-one relationship of entityResult is defined and not empty
            if (entityResults[manyToOneRelation] !== undefined && entityResults[manyToOneRelation] !== null){

                //Récupérer le nom de l'entité de la relation many-to-one
                //Get the name of the many-to-one relationship entity
                const manyToOneRelationEntity: string = entityResults[manyToOneRelation].constructor.name

                //Récupérer le DTO de l'entité de la relation many-to-one
                //Get the DTO of the many-to-one relationship entity
                const manyToOneRelationEntityDto = searchDto(dtosArray, manyToOneRelationEntity)

                //Si le DTO de l'entité de la relation many-to-one est défini
                //If the DTO of the many-to-one relationship entity is defined
                if (manyToOneRelationEntityDto !== undefined){

                    //Récupérer les paramètres que prend le DTO de l'entité de la relation many-to-one
                    //Get the parameters that the DTO of the many-to-one relationship entity takes
                    const manyToOneRelationParamNames = getFunctionParams(manyToOneRelationEntityDto)

                    //Déclarer un tableau qui contiendra les valeurs du DTO de l'entité de la relation many-to-one
                    //Declare an array that will contain the values of the DTO of the many-to-one relationship entity
                    let manyToOneRelationValues : typeof manyToOneRelationEntityDto

                    //Récupérer les valeurs de chacun des paramètres du DTO de l'entité de la relation many-to-one
                    //Get the values of each of the parameters of the DTO of the many-to-one relationship entity
                    const manyToOneRelationParamValues = manyToOneRelationParamNames.map(manyToOneRelationParamName => dtoValues[manyToOneRelation][manyToOneRelationParamName])

                    // @ts-ignore
                    //Déclarer une nouvelle instance du DTO de l'entité de la relation many-to-one et lui passer les valeurs à retourner
                    //Declare a new instance of the DTO of the many-to-one relationship entity and pass it the values to return
                    manyToOneRelationValues = new manyToOneRelationEntityDto(...manyToOneRelationParamValues)

                    //Assigner les valeurs du tableau au DTO de l'entité de la relation many-to-one
                    //Assign the values of the array to the DTO of the many-to-one relationship entity
                    dtoValues[manyToOneRelation] = manyToOneRelationValues

                }

            }
        })
    }

    //Si l'entité possède des relations one-to-many
    //If the entity has one-to-many relationships
    if (oneToManyRelations.length !== 0){

        //Pour chacune des relations one-to-many
        //For each of the one-to-many relationships
        oneToManyRelations.forEach(oneToManyRelation => {

            //Si la relation one-to-many de entityResult est définie et qu'elle n'est pas vide
            //If the one-to-many relationship of entityResult is defined and not empty
            if (entityResults[oneToManyRelation] !== undefined && entityResults[oneToManyRelation].length !== 0){

                //Récupérer le nom de l'entité de la relation one-to-many
                //Get the name of the one-to-many relationship entity
                const oneToManyRelationEntity: string = entityResults[oneToManyRelation][0].constructor.name

                //Récupérer le DTO de l'entité de la relation one-to-many
                //Get the DTO of the one-to-many relationship entity
                const oneToManyRelationEntityDto = searchDto(dtosArray, oneToManyRelationEntity)

                //Si le DTO de l'entité de la relation one-to-many est défini
                //If the DTO of the one-to-many relationship entity is defined
                if (oneToManyRelationEntityDto !== undefined){

                    //Récupérer les paramètres que prend le DTO de l'entité de la relation one-to-many
                    //Get the parameters that the DTO of the one-to-many relationship entity takes
                    const oneToManyRelationParamNames = getFunctionParams(oneToManyRelationEntityDto)

                    //Déclarer un tableau qui contiendra les valeurs du DTO de l'entité de la relation one-to-many
                    //Declare an array that will contain the values of the DTO of the one-to-many relationship entity
                    const oneToManyRelationValues : typeof oneToManyRelationEntityDto[] = []

                    //Pour chacune des données de la relation one-to-many
                    //For each of the one-to-many relationship data
                    dtoValues[oneToManyRelation].forEach(oneToManyRelationData => {

                        //Récupérer les valeurs de chacun des paramètres du DTO de l'entité de la relation one-to-many
                        //Get the values of each of the parameters of the DTO of the one-to-many relationship entity
                        const oneToManyRelationParamValues = oneToManyRelationParamNames.map(oneToManyRelationParamName => oneToManyRelationData[oneToManyRelationParamName])

                        // @ts-ignore
                        //Déclarer une nouvelle instance du DTO de l'entité de la relation one-to-many et lui passer les valeurs à retourner
                        //Declare a new instance of the DTO of the one-to-many relationship entity and pass it the values to return
                        const oneToManyRelationDtoData : typeof oneToManyRelationEntityDto = new oneToManyRelationEntityDto(...oneToManyRelationParamValues)

                        //Ajouter les valeurs du tableau au DTO de l'entité de la relation one-to-many
                        //Add the values of the array to the DTO of the one-to-many relationship entity
                        oneToManyRelationValues.push(oneToManyRelationDtoData);
                    })

                    //Assigner les valeurs du tableau au DTO de l'entité de la relation one-to-many
                    //Assign the values of the array to the DTO of the one-to-many relationship entity
                    dtoValues[oneToManyRelation] = oneToManyRelationValues
                }

            }

        })
    }

    //Si l'entité possède des relations one-to-one
    //If the entity has one-to-one relationships
    if (oneToOneRelations.length !== 0){

        //Pour chacune des relations one-to-one
        //For each of the one-to-one relationships
        oneToOneRelations.forEach(oneToOneRelation => {

            //Si la relation one-to-one de entityResult est définie
            //If the one-to-one relationship of entityResult is defined
            if (entityResults[oneToOneRelation] !== undefined){

                //Récupérer le nom de l'entité de la relation one-to-one
                //Get the name of the one-to-one relationship entity
                const oneToOneRelationEntity: string = entityResults[oneToOneRelation].constructor.name

                //Récupérer le DTO de l'entité de la relation one-to-one
                //Get the DTO of the one-to-one relationship entity
                const oneToOneRelationEntityDto = searchDto(dtosArray, oneToOneRelationEntity)

                //Si le DTO de l'entité de la relation one-to-one est défini
                //If the DTO of the one-to-one relationship entity is defined
                if (oneToOneRelationEntityDto !== undefined){

                    //Récupérer les paramètres que prend le DTO de l'entité de la relation one-to-one
                    //Get the parameters that the DTO of the one-to-one relationship entity takes
                    const oneToOneRelationParamNames = getFunctionParams(oneToOneRelationEntityDto)

                    //Déclarer une nouvelle instance du DTO de l'entité de la relation one-to-one et lui passer les valeurs à retourner
                    //Declare a new instance of the DTO of the one-to-one relationship entity and pass it the values to return
                    let oneToOneRelationValues : typeof oneToOneRelationEntityDto

                    //Récupérer les valeurs de chacun des paramètres du DTO de l'entité de la relation one-to-one
                    //Get the values of each of the parameters of the DTO of the one-to-one relationship entity
                    const oneToOneRelationParamValues = oneToOneRelationParamNames.map(oneToOneRelationParamName => dtoValues[oneToOneRelation][oneToOneRelationParamName])

                    // @ts-ignore
                    //Déclarer une nouvelle instance du DTO de l'entité de la relation one-to-one et lui passer les valeurs à retourner
                    //Declare a new instance of the DTO of the one-to-one relationship entity and pass it the values to return
                    oneToOneRelationValues = new oneToOneRelationEntityDto(...oneToOneRelationParamValues)

                    //Assigner les valeurs du tableau au DTO de l'entité de la relation one-to-one
                    //Assign the values of the array to the DTO of the one-to-one relationship entity
                    dtoValues[oneToOneRelation] = oneToOneRelationValues

                }

            }
        })
    }
    //Retourner le DTO de l'entité
    //Return the DTO of the entity
    return dtoValues;

}

//Todo: vérifier si cette fonction garde toujours une utilité actuellement