import {TheObject} from "../../types";
import generateTheEntity from "./generateTheEntity";
import generateTheCache from "./generateTheCache";
import generateTheDto from "./generateTheDto";
import generateTheAccess from "./generateTheAccess";
import generateTheRouter from "./generateTheRouter";
import generateSwagger from "./generateSwagger";
import generateTheSwaggerImplement from "./generateTheSwaggerImplement";
import getTheFiles from "./getTheFiles";

//Fonction qui génère l'ensemble de fichiers nécessaire au focntionnement de l'API
//Function that generates the set of files necessary for the operation of the API
function generateTheApi(theObjects: TheObject[]) {
    theObjects.forEach(theObject => {
        generateTheEntity(theObject);
        generateTheDto(theObject);
        generateTheCache(theObject);
        generateTheAccess(theObject);
        generateTheRouter(theObject);
        generateTheSwaggerImplement(theObject);
    });

    generateSwagger(theObjects);

};

//Récupérer l'ensemble des objects "TheObject"
//Get all "TheObject" objects
const theObjects: TheObject[] = getTheFiles();

//Générer l'API
//Generate the API
generateTheApi(theObjects);