import {cacheService} from "./cache.js";
import {getFile} from "./getFile.js";

async function getFileData(filename, ...pathChunks) {
    try{
        const cachedData = cacheService.getFromCache(filename);
        if(cachedData){
            console.log('cached data return');
            return cachedData;
        }
        console.log('getfile data return');
        return await getFile(...pathChunks);
    } catch (error) {
        console.error(error);
    }
}

export {getFileData}