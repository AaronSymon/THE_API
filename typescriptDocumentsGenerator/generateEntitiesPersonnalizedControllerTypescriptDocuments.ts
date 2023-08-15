import {entitiesArray} from "../src/array/entities.array";
import generatePersonalizedControllerTypescriptDocument
    from "../src/tools/router/personalizedController/generatePersonalizedControllerTypescriptDocument";

entitiesArray.forEach(entity => {

    generatePersonalizedControllerTypescriptDocument(entity)

})