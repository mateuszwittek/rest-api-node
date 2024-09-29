import {cacheService} from "./cache.js";
import {getFile} from "./getFile.js";

async function getData(...pathChunks) {
    const cachedData = cacheService.getFromCache('people-data');
    if(cachedData){
        console.log('cached data return');
        return cachedData;
    }
    console.log('getfile data return');
    return await getFile(...pathChunks);
}

export {getData}