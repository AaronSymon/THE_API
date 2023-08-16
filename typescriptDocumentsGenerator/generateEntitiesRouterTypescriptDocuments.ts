import {entitiesArray} from "../src/array/entities.array";
import generateRouterControllerTypescriptDocument from "../src/tools/router/generateRouterControllerTypescriptDocument";

async function processGenerateRouter(entitiesArray: Function[]) {

    const promises = entitiesArray.map(async entity => {
        await generateRouterControllerTypescriptDocument(entity)
    });

    await Promise.all(promises);

    console.log("All router documents created")

}

processGenerateRouter(entitiesArray)
    .then(() => {
        console.log("Processing complete.")
        console.log("Press ctrl+c to exit.")
    })
    .catch(error => {
        console.log("An error occurred while processing.", error);
    })