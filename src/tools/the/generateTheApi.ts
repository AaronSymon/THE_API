import {TheObject} from "../../types";
import generateTheEntity from "./generateTheEntity";
import generateTheCache from "./generateTheCache";
import generateTheDto from "./generateTheDto";
import generateTheAccess from "./generateTheAccess";
import generateTheRouter from "./generateTheRouter";
import generateSwagger from "./generateSwagger";
import generateTheSwaggerImplement from "./generateTheSwaggerImplement";
import getTheFiles from "./getTheFiles";

function generateTheApi(theObjects: TheObject[]) {
    theObjects.forEach(theObject => {
        generateTheEntity(theObject)
        generateTheDto(theObject)
        generateTheCache(theObject)
        generateTheAccess(theObject)
        generateTheRouter(theObject)
        generateTheSwaggerImplement(theObject)
    })

    generateSwagger(theObjects)

}

const theObjects: TheObject[] = getTheFiles();
generateTheApi(theObjects)