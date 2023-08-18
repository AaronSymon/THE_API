import * as path from 'path';
import * as glob from 'glob';

//Fonction mountRouter, permet de récupérer tous les fichiers router.js et de les ajouter dans un tableau
//Function mountRouter, allows to get all router.js files and add them in an array
export default function mountRouter () {

    //Récupérer le chemin du dossier router
    //Get the path of the router folder
    const directoryPath : string = path.join(__dirname, `../../router`);

    //Récupérer tous les fichiers router.js
    //Get all router.js files
    const routers: string[] = glob.sync(`${directoryPath}/**/*.router.js`)

    //Créer un tableau qui contiendra tous les fichiers router.js
    //Create an array that will contain all router.js files
    const expressRouters : {pathName: string, router: Function}[] = []

    //Pour chaque fichier router.js, récupérer le nom du fichier et le nom de l'entité
    //For each router.js file, get the file name and the entity name
    routers.forEach((router) =>{

        //Récupérer le nom du fichier (entity.name.toLowerCase().router.js)
        //Get the file name (entity.name.toLowerCase().router.js)
        const startIndex = router.lastIndexOf('/');

        const desiredPath = router.substring(startIndex);

        //Récupérer le nom(entity.name.toLowerCase())
        const dotIndex = desiredPath.indexOf('.');
        const pathName: string = desiredPath.substring(0, dotIndex);

        //Récupérer le module
        //Get the module
        const module = require(router);

        //Pour chaque clé du module, vérifier si c'est un router
        //For each key of the module, check if it's a router
        Object.keys(module).forEach((key) => {

            //Si c'est un router, l'ajouter dans le tableau
            //If it's a router, add it in the array
            const isRouter = module[key]
            if (typeof isRouter === 'function'){
                const expressRouter: {pathName: string, router: Function} = {pathName: pathName, router: isRouter}
                expressRouters.push(expressRouter)
            }
        })

    })

    //Retourner le tableau
    //Return the array
    return expressRouters

}