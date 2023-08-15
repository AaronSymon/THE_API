import generateEntityAccessTypescriptDocument from "../src/tools/access/generateEntityAccessTypescriptDocument";
import {entitiesArray} from "../src/array/entities.array";

entitiesArray.forEach(entity=> {

    generateEntityAccessTypescriptDocument(entity)

});