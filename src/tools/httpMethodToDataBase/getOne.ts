import {AppDataSource} from "../../data-source.config";
import {dtosArray} from "../../array/dtos.array";
import {searchEntityDto} from "../dtos/searchEntityDto";
import {getEntityDtoValues} from "../dtos/getEntityDtoValue";

export default async function getOne(entity: Function, id: number) {

    try {

        const entityRepository = AppDataSource.getRepository(entity);

        const One = await entityRepository.findOne({where: {id: id}});

        const entityDto = searchEntityDto(dtosArray, entity.name);

        //Si l'entité possède un dto
        if (entityDto !== undefined) {

            //Retourner le dto de l'entité
            return getEntityDtoValues(entity, entityDto, One);

        } else {

            //Sinon retourner le résultat de la recherche
            return One;

        }

    } catch (e) {

        //console.log(e)
        return {error: `une erreur est survenue durant la récupération de ${entity.name} ayant pour id : ${id}`}

    }

}