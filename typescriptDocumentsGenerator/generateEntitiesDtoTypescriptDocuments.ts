import {entitiesArray} from "../src/array/entities.array";
import generateEntityDtoTypescriptDocument from "../src/tools/dtos/generateEntityDtoTypescriptDocument";

async function processGenerateEntityDto(entitiesArray: Function[]) {

    const promises = entitiesArray.map(async entity => {
        await generateEntityDtoTypescriptDocument(entity)
    });

    await Promise.all(promises);

    console.log("All entityDto documents created")

}

processGenerateEntityDto(entitiesArray)
    .then(() => {
    console.log("Processing complete.")
    console.log("Press ctrl+c to exit.")
    })
    .catch(error => {
    console.log("An error occurred while processing.", error);
    })