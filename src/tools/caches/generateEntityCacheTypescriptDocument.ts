import * as path from 'path';
import * as fs from 'fs';
export default function generateEntityCacheTypescriptDocument(entity: Function) {

    const filePath = path.join(__dirname, `../../../../src/cache/${entity.name.toLowerCase()}.cache.ts`);

    let fileContent: string = ''

    fileContent += `import {${entity.name}} from \'../entity/${entity.name.toLowerCase()}.entity\';\n\n`;

    fileContent += `export const ${entity.name.toLowerCase()}Cache : entityCache = {

    entity : ${entity.name},
    isEntityCached : true
}`

    fs.writeFileSync(filePath, fileContent);
    console.log(`Generated ${entity.name.toLowerCase()}.cache.ts file successfully`);

}