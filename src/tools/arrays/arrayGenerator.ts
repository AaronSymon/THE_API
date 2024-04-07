//Import path
import * as path from 'path';
//Import fs
import * as glob from 'glob';


//Fonction arrayGenerator, qui prend en paramètre le type de fichier pour lequel on veut générer un tableau
//et qui retourne un tableau contenant toutes les classes et fonctions exportées dans le dossier correspondant au type de fichier
//Function arrayGenerator, which takes as parameter the type of file for which we want to generate an array
//and which returns an array containing all the classes and functions exported in the folder corresponding to the type of file
export function arrayGenerator(type : string) : Function[] {

    //Définition de directoryPath, qui correspond au chemin du dossier contenant les fichiers à importer
    //Definition of directoryPath, which corresponds to the path of the folder containing the files to be imported
    const directoryPath = path.join(__dirname, `../../${type}`);

    // Tableau qui contiendra les classes exportées
    // Array that will contain the exported classes
    let generatedArray: Function[] = [];

    // Utiliser glob pour rechercher tous les fichiers javaScript dans le dossier
    // Use glob to search for all javaScript files in the folder
    const files : string[]= glob.sync(`${directoryPath}/**/*.${type}.js`);

    // Importer chaque fichier et ajouter ses exportations au tableau
    // Import each file and add its exports to the array
    files.forEach(file => {
        const module = require(file);
        Object.keys(module).forEach(key => {
            const exportedItem = module[key];
            if (typeof exportedItem === 'function' || typeof  exportedItem === "object") {
                generatedArray.push(exportedItem);
            }
        });
    });

    // Retourner le tableau contenant toutes les classes et fonctions exportées
    // Return the array containing all the exported classes and functions
    return generatedArray

}