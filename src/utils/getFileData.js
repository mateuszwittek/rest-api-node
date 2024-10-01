import { cacheService } from './cache.js';
import { getFile } from './getFile.js';
import { getFileName, validJSON } from './utils.js';

const checkIfJSON = file => validJSON(file);

const getFileData = async filePath => {
  const fileName = getFileName(filePath);
  const cachedData = cacheService.getFromCache(fileName);

  if (cachedData) {
    return cachedData;
  }

  try {
    const file = await getFile(filePath);
    const JSONFile = checkIfJSON(file);
    cacheService.saveToCache(fileName, JSONFile);
    return JSONFile;
  } catch (error) {
    throw error;
  }
};

export { getFileData };
