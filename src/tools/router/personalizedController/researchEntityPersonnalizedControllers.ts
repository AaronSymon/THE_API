import * as path from 'path';
import * as glob from 'glob';
import {getFunctionParams} from "../../functions/getFunctionParams";
import {AppDataSource} from "../../../data-source.config";
import {personalizedController} from "../../../types";

//Fonction researchEntityPersonnalizedControllers qui permet de rechercher les controllers personnalisés d'une entité
//Function researchEntityPersonnalizedControllers that allows to search the personalized controllers of an entity
export default async function researchEntityPersonnalizedControllers(entity: Function): Promise<personalizedController[]> {

    //Définir dataSource qui contient les informations de la base de données
    //Define dataSource which contains the information of the database
    const dataSource = await AppDataSource.initialize()

    //Définir entityMetadata qui contient les informations de la table entity
    //Define entityMetadata which contains the information of the table entity
    const entityMetadata = dataSource.manager.getRepository(entity).metadata

    //Définir entityColumns qui contient les informations des colonnes de la table entity
    //Define entityColumns which contains the information of the columns of the table entity
    const entityColumns = entityMetadata.columns

    //const entityRelations = entityMetadata.relations

    //Définir entityDto qui contient les informations du dto de l'entité
    //Define entityDto which contains the information of the dto of the entity
    //const entityDto = searchEntityDto(dtosArray, entity.name)

    //Définir directoryPath qui contient le chemin du dossier des controllers personnalisés
    //Define directoryPath which contains the path of the personalized controllers folder
    const directoryPath: string = path.join(__dirname, `../../../router/personalizedController`);

    //Définir personalizedControllersFiles qui contient les fichiers des controllers personnalisés
    //Define personalizedControllersFiles which contains the files of the personalized controllers
    const personalizedControllersFiles: string[] = glob.sync(`${directoryPath}/${entity.name.toLowerCase()}.personalizedController.js`)

    //Définir personalizedControllers qui contient les controllers personnalisés
    //Define personalizedControllers which contains the personalized controllers
    const personalizedControllers: personalizedController[] = []

    //Parcourir personalizedControllersFiles
    //Browse personalizedControllersFiles
    personalizedControllersFiles.forEach((personalizedControllerFile) => {

        //Définir module qui contient les controllers personnalisés
        //Define module which contains the personalized controllers
        const module = require(personalizedControllerFile);

        //Parcourir module
        //Browse module
        Object.keys(module).forEach((key) => {

            //Définir isPersonalizedController qui contient le controller personnalisé
            //Define isPersonalizedController which contains the personalized controller
            const isPersonalizedController = module[key]

            //Vérifier si isPersonalizedController est une fonction
            //Check if isPersonalizedController is a function
            if (typeof isPersonalizedController === 'function') {

                //Définir controllerParams qui contient les paramètres du controller personnalisé
                //Define controllerParams which contains the parameters of the personalized controller
                const controllerParams: {paramName: string, paramType: string, paramRegex: string}[] = []
                const isPersonalizedControllerParams = getFunctionParams(isPersonalizedController)

                //Parcourir isPersonalizedControllerParams
                //Browse isPersonalizedControllerParams
                isPersonalizedControllerParams.forEach((isPersonalizedControllerParam) => {


                        //Définir entityColumn qui contient la colonne de la table entity
                        //Define entityColumn which contains the column of the table entity
                        const entityColumn = entityColumns.find((entityColumn) => {
                            return entityColumn.propertyName === isPersonalizedControllerParam
                        })

                        //Définir entityColumnName qui contient le nom de la colonne de la table entity
                        //Define entityColumnName which contains the name of the column of the table entity
                        const entityColumnName = entityColumn.propertyName

                        //Définir entityColumnType qui contient le type de la colonne de la table entity
                        //Define entityColumnType which contains the type of the column of the table entity
                        let entityColumnType: string = entityColumn.type.toString()

                        //Définir paramRegex qui contient le regex du paramètre
                        //Define paramRegex which contains the regex of the parameter
                        let paramRegex: string = ''

                        //Vérifier si entityColumnType est un nombre
                        //Check if entityColumnType is a number
                        if (number.has(entityColumnType)) {
                            //Définir paramRegex qui contient le regex du paramètre
                            //Define paramRegex which contains the regex of the parameter
                            paramRegex = '(\\\\d+)'
                        }
                        //Vérifier si entityColumnType est une chaines de caractères
                        //Check if entityColumnType is a string
                        if (string.has(entityColumnType)) {
                            paramRegex = '([a-zA-Z0-9@#?!%20%3F.]+)'
                        }

                        //Insérer dans controllerParams le nom, le type et le regex du paramètre
                        //Insert in controllerParams the name, the type and the regex of the parameter
                        controllerParams.push({paramName: entityColumnName, paramType: entityColumnType, paramRegex: paramRegex})


                })

                //Définir personalizedController qui contient le controller personnalisé
                //Define personalizedController which contains the personalized controller
                const personalizedController: personalizedController = {
                    controllerName: isPersonalizedController.name,
                    controllerParams: controllerParams,
                    controller: isPersonalizedController
                }

                //Insérer dans personalizedControllers le controller personnalisé
                //Insert in personalizedControllers the personalized controller
                personalizedControllers.push(personalizedController)
            }
        })
    })

    //Retourner personalizedControllers
    //Return personalizedControllers
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

//Todo: vérifier si cette fonction garde toujours une utilité actuellement