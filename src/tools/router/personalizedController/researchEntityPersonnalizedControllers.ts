import * as path from 'path';
import * as glob from 'glob';
import {searchEntityDto} from "../../dtos/searchEntityDto";
import {dtosArray} from "../../../array/dtos.array";
import {getFunctionParams} from "../../functions/getFunctionParams";
import {AppDataSource} from "../../../data-source.config";
export default async function researchEntityPersonnalizedControllers(entity: Function): Promise<personalizedController[]> {


        const dataSource = await AppDataSource.initialize()

        //Définir entityMetadata qui contient les informations de la table entity
        const entityMetadata = dataSource.manager.getRepository(entity).metadata

        //Définir entityColumns qui contient les informations des colonnes de la table entity
        const entityColumns = entityMetadata.columns

        const entityRelations = entityMetadata.relations


        const entityDto = searchEntityDto(dtosArray, entity.name)
        const entityDtoParams = getFunctionParams(entityDto)

        const directoryPath: string = path.join(__dirname, `../../../router/personalizedController`);
        const personalizedControllersFiles: string[] = glob.sync(`${directoryPath}/${entity.name.toLowerCase()}.personalizedController.js`)

        const personalizedControllers: personalizedController[] = []


        personalizedControllersFiles.forEach((personalizedControllerFile) => {

            const module = require(personalizedControllerFile);

            Object.keys(module).forEach((key) => {

                const isPersonalizedController = module[key]
                if (typeof isPersonalizedController === 'function') {

                    const controllerParams: {paramName: string, paramType: string, paramRegex: string}[] = []
                    const isPersonalizedControllerParams = getFunctionParams(isPersonalizedController)

                    isPersonalizedControllerParams.forEach((isPersonalizedControllerParam) => {

                        if (entityDtoParams.includes(isPersonalizedControllerParam)) {

                            const entityColumn = entityColumns.find((entityColumn) => {
                                return entityColumn.propertyName === isPersonalizedControllerParam
                            })

                            const entityColumnName = entityColumn.propertyName
                            let entityColumnType: string = entityColumn.type.toString()
                            let paramRegex: string = ''

                            if (number.has(entityColumnType)) {
                                paramRegex = '(\\\\d+)'
                            }
                            if (string.has(entityColumnType)) {
                                paramRegex = '([a-zA-Z0-9@#?!%20%3F.]+)'
                            }

                            controllerParams.push({paramName: entityColumnName, paramType: entityColumnType, paramRegex: paramRegex})

                        }
                    })

                    const personalizedController: personalizedController = {
                        controllerName: isPersonalizedController.name,
                        controllerParams: controllerParams,
                        controller: isPersonalizedController
                    }

                    personalizedControllers.push(personalizedController)
                }
            })
        })

        return personalizedControllers;

};

const number: Set<string> = new Set<string>([
    'tinyint',
    'smallint',
    'mediumint',
    'int',
    'integer',
    'bigint',
    'float',
    'double',
    'numeric'
])

const string: Set<string> = new Set<string>([
    'tinytext',
    'mediumtext',
    'text',
    'longtext',
    'char',
    'varchar'
])

const date: Set<string> = new Set<string>([
    'date',
    'datetime',
    'time',
    'timestamp'
])