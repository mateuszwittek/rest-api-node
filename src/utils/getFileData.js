import { cacheService } from "./cache.js";
import { getFile } from "./getFile.js";
import { getFileName } from "./utils.js";


async function getFileData(filePath) {
    const fileName = getFileName(filePath);
    try{
        const cachedData = cacheService.getFromCache(fileName);
        if(cachedData){
            console.log('cached data return');
            return cachedData;
        }
        console.log('getfile data return');
        const file = await getFile(filePath);
        cacheService.saveToCache(fileName, file);
        return file;
    } catch (error) {
        console.error(error);
    }
}

export {getFileData}