import * as path from 'path';
import * as glob from 'glob';

export default function mountRouter () {

    const directoryPath : string = path.join(__dirname, `../../router`);
    const routers: string[] = glob.sync(`${directoryPath}/**/*.router.js`)

    const expressRouters : {pathName: string, router: Function}[] = []

    routers.forEach((router) =>{

        //Récupérer le nom du fichier (entity.name.toLowerCase().router.js)
        const startIndex = router.lastIndexOf('/');
        const desiredPath = router.substring(startIndex);

        //Récupérer le nom(entity.name.toLowerCase())
        const dotIndex = desiredPath.indexOf('.');
        const pathName: string = desiredPath.substring(0, dotIndex);

        const module = require(router);
        Object.keys(module).forEach((key) => {
            const isRouter = module[key]
            if (typeof isRouter === 'function'){
                const expressRouter: {pathName: string, router: Function} = {pathName: pathName, router: isRouter}
                expressRouters.push(expressRouter)
            }
        })

    })

    return expressRouters

}