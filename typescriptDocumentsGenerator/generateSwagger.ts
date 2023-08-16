import generateSwaggerTypescriptDocument from "../src/tools/swagger/generateSwaggerTypescriptDocument";
import {entitiesArray} from "../src/array/entities.array";

async function processGenerateSwagger(entitiesArray: Function[]) {

    await generateSwaggerTypescriptDocument(entitiesArray)

    console.log("Swagger documents created")

}

processGenerateSwagger(entitiesArray)
    .then(() => {
        console.log("Processing complete.")
        console.log("Press ctrl+c to exit.")
    })
    .catch(error => {
        console.log("An error occurred while processing.", error)
    })