import {entitiesArray} from "../src/array/entities.array";
import generateEntityDtoTypescriptDocument from "../src/tools/dtos/generateEntityDtoTypescriptDocument";

entitiesArray.forEach(entity => {
    generateEntityDtoTypescriptDocument(entity).then(r => {})
})