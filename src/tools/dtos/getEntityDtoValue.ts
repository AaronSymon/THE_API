import {dtosArray} from "../../array/dtos.array";
import {searchDto} from "./searchDto";
import {getFunctionParams} from "../functions/getFunctionParams";
import {getEntityRelationByType} from "../entities/getEntityRelationByType";


export function getEntityDtoValues(entity: Function, entityDto: Function | object, entityResults: unknown): Function {

    //Récupérer les paramètres que prend le DTO, ils correspondent aux données de l'entité à renvoyer
    const paramNames = getFunctionParams(entityDto)

    //Attribuer à chacun des paramètres la valeur de l'entité à renvoyer
    const paramValues = paramNames.map( paramName => entityResults[paramName])

    // @ts-ignore
    //Déclarer une nouvelle instance du DTO de l'entité et lui passer les valeurs à retourner
    const dtoValues : typeof entityDto = new entityDto(...paramValues)

    const manyToManyRelations : string[] = getEntityRelationByType(entity,"many-to-many");
    const manyToOneRelations : string[] = getEntityRelationByType(entity,"many-to-one");
    const oneToManyRelations : string[] = getEntityRelationByType(entity, "one-to-many");
    const oneToOneRelations : string[] = getEntityRelationByType(entity,"one-to-one");

    if (manyToManyRelations.length !== 0){

        manyToManyRelations.forEach(manyToManyRelation => {

            if (entityResults[manyToManyRelation] !== undefined && entityResults[manyToManyRelation].length !== 0){

                const manyToManyRelationEntity: string = entityResults[manyToManyRelation][0].constructor.name

                const manyToManyRelationEntityDto = searchDto(dtosArray, manyToManyRelationEntity)

                if (manyToManyRelationEntityDto !== undefined){
                    const manyToManyRelationParamNames = getFunctionParams(manyToManyRelationEntityDto)
                    const manyToManyRelationValues : typeof manyToManyRelationEntityDto[] = []

                    dtoValues[manyToManyRelation].forEach(manyToManyRelationData => {
                        const manyToManyRelationParamValues = manyToManyRelationParamNames.map(manyToManyRelationParamName => manyToManyRelationData[manyToManyRelationParamName])

                        // @ts-ignore
                        const manyToManyRelationDtoData : typeof manyToManyRelationEntityDto = new manyToManyRelationEntityDto(...manyToManyRelationParamValues)

                        manyToManyRelationValues.push(manyToManyRelationDtoData);
                    })

                    dtoValues[manyToManyRelation] = manyToManyRelationValues
                }

            }

        })
    }

    if (manyToOneRelations.length !== 0){

        manyToOneRelations.forEach(manyToOneRelation => {

            if (entityResults[manyToOneRelation] !== undefined && entityResults[manyToOneRelation] !== null){

                const manyToOneRelationEntity: string = entityResults[manyToOneRelation].constructor.name
                const manyToOneRelationEntityDto = searchDto(dtosArray, manyToOneRelationEntity)

                if (manyToOneRelationEntityDto !== undefined){
                    const manyToOneRelationParamNames = getFunctionParams(manyToOneRelationEntityDto)

                    let manyToOneRelationValues : typeof manyToOneRelationEntityDto

                    const manyToOneRelationParamValues = manyToOneRelationParamNames.map(manyToOneRelationParamName => dtoValues[manyToOneRelation][manyToOneRelationParamName])

                    // @ts-ignore
                    manyToOneRelationValues = new manyToOneRelationEntityDto(...manyToOneRelationParamValues)

                    dtoValues[manyToOneRelation] = manyToOneRelationValues

                }

            }
        })
    }

    if (oneToManyRelations.length !== 0){

        oneToManyRelations.forEach(oneToManyRelation => {

            if (entityResults[oneToManyRelation] !== undefined && entityResults[oneToManyRelation].length !== 0){

                const oneToManyRelationEntity: string = entityResults[oneToManyRelation][0].constructor.name

                const oneToManyRelationEntityDto = searchDto(dtosArray, oneToManyRelationEntity)

                if (oneToManyRelationEntityDto !== undefined){
                    const oneToManyRelationParamNames = getFunctionParams(oneToManyRelationEntityDto)
                    const oneToManyRelationValues : typeof oneToManyRelationEntityDto[] = []

                    dtoValues[oneToManyRelation].forEach(oneToManyRelationData => {
                        const oneToManyRelationParamValues = oneToManyRelationParamNames.map(oneToManyRelationParamName => oneToManyRelationData[oneToManyRelationParamName])

                        // @ts-ignore
                        const oneToManyRelationDtoData : typeof oneToManyRelationEntityDto = new oneToManyRelationEntityDto(...oneToManyRelationParamValues)

                        oneToManyRelationValues.push(oneToManyRelationDtoData);
                    })

                    dtoValues[oneToManyRelation] = oneToManyRelationValues
                }

            }

        })
    }

    if (oneToOneRelations.length !== 0){
        oneToOneRelations.forEach(oneToOneRelation => {

            if (entityResults[oneToOneRelation] !== undefined){

                const oneToOneRelationEntity: string = entityResults[oneToOneRelation].constructor.name

                const oneToOneRelationEntityDto = searchDto(dtosArray, oneToOneRelationEntity)

                if (oneToOneRelationEntityDto !== undefined){
                    const oneToOneRelationParamNames = getFunctionParams(oneToOneRelationEntityDto)

                    let oneToOneRelationValues : typeof oneToOneRelationEntityDto

                    const oneToOneRelationParamValues = oneToOneRelationParamNames.map(oneToOneRelationParamName => dtoValues[oneToOneRelation][oneToOneRelationParamName])

                    // @ts-ignore
                    oneToOneRelationValues = new oneToOneRelationEntityDto(...oneToOneRelationParamValues)

                    dtoValues[oneToOneRelation] = oneToOneRelationValues

                }

            }
        })
    }

    //Retourner le DTO de l'entité
    return <Function>dtoValues

}