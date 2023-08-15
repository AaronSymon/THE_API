import {AppDataSource} from "../../data-source.config";

export default async function insert(entity: Function, data: Partial<any>) {

    try {

        const entityRepository = AppDataSource.getRepository(entity);

        let entityInstance = entityRepository.create(data);

        return await entityRepository.save(entityInstance)

    } catch (e) {

        //console.log(e);
        return {error: `une erreur est survenue durant l'insertion de ${entity.name}`}

    }

}