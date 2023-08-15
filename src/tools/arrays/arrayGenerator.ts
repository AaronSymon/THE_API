import * as path from 'path';
import * as glob from 'glob';


export function arrayGenerator(type : string) : Function[] {
    const directoryPath = path.join(__dirname, `../../${type}`);


// Tableau qui contiendra les classes exportées
    let generatedArray: Function[] = [];

// Utiliser glob pour rechercher tous les fichiers javaScript dans le dossier
    const files : string[]= glob.sync(`${directoryPath}/**/*.${type}.js`);

// Importer chaque fichier et ajouter ses exportations au tableau
    files.forEach(file => {
        const module = require(file);
        Object.keys(module).forEach(key => {
            const exportedItem = module[key];
            if (typeof exportedItem === 'function' || typeof  exportedItem === "object") {
                generatedArray.push(exportedItem);
            }
        });
    });



    return generatedArray

}