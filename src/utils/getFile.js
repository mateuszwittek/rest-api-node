import path from "node:path";
import fs from "node:fs/promises";
import {cacheService} from "./cache.js";
import {validJSON} from "./utils.js";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getFile(...pathChunks) {
    const filePath = path.resolve(__dirname, '../', ...pathChunks);
    const fileName = path.parse(filePath).name;

    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const value = validJSON(fileContent) || fileContent;
        cacheService.saveToCache(fileName, value);
        return value;
    } catch (error) {
        console.error('Error reading file:', error);
        throw new Error ('Error reading file');
    }
}

export { getFile };