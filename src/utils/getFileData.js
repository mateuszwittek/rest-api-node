import { cacheService } from './cache.js';
import { getFile } from './getFile.js';
import { getFileName, validJSON } from './utils.js';
import { messages, errors } from './errorHandler.js';

const getFileData = async filePath => {
  if (!filePath) {
    throw errors.BAD_REQUEST(messages.error.MISSING_FILE_PATH);
  }

  try {
    const fileName = getFileName(filePath);

    const cachedData = cacheService.getFromCache(fileName);

    if (cachedData) {
      return cachedData;
    }

    const fileContent = await getFile(filePath);

    const jsonData = validJSON(fileContent);

    cacheService.saveToCache(fileName, jsonData);

    return jsonData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw errors.BAD_REQUEST(messages.error.INVALID_JSON);
    }

    throw error;
  }
};

export { getFileData };
