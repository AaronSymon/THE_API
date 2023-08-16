import {entitiesArray} from "../src/array/entities.array";
import generateSwaggerImplementTypescriptDocument from "../src/tools/swagger/generateSwaggerImplementTypescriptDocument";

async function processGenerateSwaggerImplement(entitiesArray: Function[]) {

     const promises = entitiesArray.map(async entity => {
          await generateSwaggerImplementTypescriptDocument(entity)
     });

     await Promise.all(promises);

     console.log("All swaggerImplement documents created")

}

processGenerateSwaggerImplement(entitiesArray)
    .then(() => {
         console.log("Processing complete.")
        console.log("Press ctrl+c to exit.")
    })
    .catch(error => {
         console.log("An error occurred while processing.", error);
    })