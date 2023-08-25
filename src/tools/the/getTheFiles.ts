import * as path from 'path';
import * as glob from 'glob';
import {TheObject} from "../../types";

export default function getTheFiles () : TheObject[]{
    const directoryPath = path.join(__dirname, `../../theObject`);

    console.log(directoryPath)

    let generatedArray: TheObject[] = []

    const files = glob.sync(`${directoryPath}/**/*.the.ts`)

    files.forEach(file => {
        const module = require(file);
        Object.keys(module).forEach(key => {
            const exportedItem = module[key];
            if (typeof  exportedItem === "object") {
                generatedArray.push(exportedItem);
            }
        });
    });

    return generatedArray
}
