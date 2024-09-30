import { cacheService } from './cache.js';
import { getFile } from './getFile.js';
import { getFileName, validJSON } from './utils.js';

const parseFileContent = file => {
  try {
    return validJSON(file);
  } catch (error) {
    throw new Error(`The file is not a valid JSON file.`);
  }
};

const processFile = async filePath => parseFileContent(await getFile(filePath));

const getFileData = async filePath => {
  const fileName = getFileName(filePath);
  const cachedData = cacheService.getFromCache(fileName);

  if (cachedData) {
    return cachedData;
  }

  try {
    return await processFile(filePath);
  } catch (error) {
    throw error;
  }
};

export { getFileData };
