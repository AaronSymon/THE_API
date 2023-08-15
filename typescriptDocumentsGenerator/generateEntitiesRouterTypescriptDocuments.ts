import {entitiesArray} from "../src/array/entities.array";
import generateRouterControllerTypescriptDocument from "../src/tools/router/generateRouterControllerTypescriptDocument";

entitiesArray.forEach(entity => {
    generateRouterControllerTypescriptDocument(entity).then(r => {})
});