import fs from "node:fs/promises";
import {validJSON} from "./utils.js";

async function getFile(filePath) {
    try {
        const file = await fs.readFile(filePath, 'utf8');
        const fileContent = validJSON(file) || file;
        return fileContent;
    } catch (error) {
        console.error('Error reading file:', error);
        throw new Error ('Error reading file');
    }
}

export { getFile };