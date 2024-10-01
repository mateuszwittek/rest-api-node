import fs from 'node:fs/promises';
import { cacheService } from './cache.js';
import { getFileName } from './utils.js';

const modifyFile = async (filePath, content) => {
  try {
    const fileName = getFileName(filePath);
    await fs.writeFile(filePath, content);
    cacheService.clearCache(fileName);
  } catch (error) {
    throw error;
  }

  return await fs.writeFile(filePath, content);
};

export { modifyFile };
