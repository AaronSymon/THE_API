import {entitiesArray} from "../src/array/entities.array";
import generatePersonalizedControllerTypescriptDocument
    from "../src/tools/router/personalizedController/generatePersonalizedControllerTypescriptDocument";


function processGeneratePersonalizedController(entitiesArray: Function[]) {

    entitiesArray.forEach(entity => {
        generatePersonalizedControllerTypescriptDocument(entity)
    })

    console.log("All personalizedController documents created")
    console.log("Please wait for the end of the process...")

}

processGeneratePersonalizedController(entitiesArray)