import * as path from 'path';
import * as glob from 'glob';
import {TheObject} from "../../types";

//Fonction qui permet de récupérer les fichiers .the.ts
//Function that allows to get the .the.ts files
export default function getTheFiles () : TheObject[]{
    const directoryPath = path.join(__dirname, `../../theObject`);

    console.log(`getting all *.the.ts file at : ${directoryPath}`);

    //Array qui contiendra tous les objets générés
    //Array that will contain all the generated objects
    let generatedArray: TheObject[] = []

    //Récupérer tous les fichiers .the.ts
    //Get all .the.ts files
    const files = glob.sync(`${directoryPath}/**/*.the.ts`);

    //Pour chaque fichier récupéré, on récupère les objets exportés et on les ajoute à generatedArray
    //For each file retrieved, we get the exported objects and add them to generatedArray
    files.forEach(file => {
        const module = require(file);
        Object.keys(module).forEach(key => {
            const exportedItem = module[key];
            if (typeof  exportedItem === "object") {
                generatedArray.push(exportedItem);
            }
        });
    });

    return generatedArray;
}
