import {entitiesArray} from "../src/array/entities.array";
import generateEntityCacheTypescriptDocument from "../src/tools/caches/generateEntityCacheTypescriptDocument";

function processGenerateCache(entitiesArray: Function[]) {

    entitiesArray.forEach(entity => {
        generateEntityCacheTypescriptDocument(entity)
    })

    console.log("All cache documents created")
    console.log("Please wait for the end of the process...")
}

processGenerateCache(entitiesArray)