import {entitiesArray} from "../src/array/entities.array";
import generateSwaggerImplementTypescriptDocument from "../src/tools/swagger/generateSwaggerImplementTypescriptDocument";


entitiesArray.forEach( entity => {
     generateSwaggerImplementTypescriptDocument(entity).then(r => {})
});
