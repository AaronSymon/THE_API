import generateEntityAccessTypescriptDocument from "../src/tools/access/generateEntityAccessTypescriptDocument";
import {entitiesArray} from "../src/array/entities.array";

entitiesArray.forEach(entity=> {

    generateEntityAccessTypescriptDocument(entity)

});

function generateAccess(entitiesArray: Function[]) {

    entitiesArray.forEach(entity => {
        generateEntityAccessTypescriptDocument(entity)
    })

    console.log("All access documents created")
    console.log("Please wait for the end of the process...")
}

generateAccess(entitiesArray)