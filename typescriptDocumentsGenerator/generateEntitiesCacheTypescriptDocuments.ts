import {entitiesArray} from "../src/array/entities.array";
import generateEntityCacheTypescriptDocument from "../src/tools/caches/generateEntityCacheTypescriptDocument";

entitiesArray.forEach(entity => {
    generateEntityCacheTypescriptDocument(entity)
});