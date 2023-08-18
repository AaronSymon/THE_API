import {dtosArray} from "../../array/dtos.array";
import {searchEntityDto} from "./searchEntityDto";

export function getDtoPropertyNames(entity: Function) {

    const entityDto = searchEntityDto(dtosArray, entity.name);
    const functionText = entityDto.toString();

    const searchString = entity.name.toLowerCase();
    let properties: string[] = [];

    const lines = functionText.split('\n');
    lines.forEach(line => {
        const startIndex = line.indexOf(searchString);
        if (startIndex !== -1) {
            const propertyStartIndex = startIndex + searchString.length;
            const propertyEndIndex = line.indexOf(' ', propertyStartIndex);
            if (propertyEndIndex !== -1) {
                const property = line.substring(propertyStartIndex, propertyEndIndex).trim();
                properties.push(property);
            } else {
                const property = line.substring(propertyStartIndex).trim();
                properties.push(property);
            }
        }
    });

    const cleanedProperties = properties.map(property => {
        // Supprimer les caractères indésirables après le point
        property = property.replace(/^\./, '');

        // Supprimer tout texte après un ;, ) ou .
        property = property.split(/[);.]/)[0];

        return property;
    });

    properties = cleanedProperties.filter(property => property !== '') // Supprimer les chaînes vides
        .reduce((uniqueProperties, property) => {
            if (!uniqueProperties.includes(property)) {
                uniqueProperties.push(property);
            }
            return uniqueProperties;
        }, []);

    return properties;
}
