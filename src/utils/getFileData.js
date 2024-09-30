import { cacheService } from './cache.js';
import { getFile } from './getFile.js';
import { getFileName, validJSON } from './utils.js';

async function getFileData(filePath) {
  const fileName = getFileName(filePath);
  const cachedData = cacheService.getFromCache(fileName);

  if (cachedData) return cachedData;

  try {
    const file = await getFile(filePath);
    try {
      return validJSON(file);
    } catch (error) {
      throw new Error(`The file ${fileName} is not a valid JSON file.`);
    }
  } catch (error) {
    throw error;
  }
}

export { getFileData };
