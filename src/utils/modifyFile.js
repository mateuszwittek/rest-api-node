import fs from 'node:fs/promises';
import { cacheService } from './cache.js';
import { getFileName } from './utils.js';
import { messages, errors } from './errorHandler.js';

const modifyFile = async (filePath, content) => {
  if (!filePath || typeof filePath !== 'string') {
    throw errors.BAD_REQUEST(messages.error.INVALID_FILE_PATH);
  }

  if (content === undefined || content === null) {
    throw errors.BAD_REQUEST(messages.error.INVALID_CONTENT);
  }

  try {
    const fileName = getFileName(filePath);
    await fs.writeFile(filePath, content);
    cacheService.clearCache(fileName);
    return { status: 200, message: messages.success.FILE_UPDATED };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw errors.NOT_FOUND();
    } else if (error.code === 'EACCES') {
      throw errors.FORBIDDEN();
    } else {
      throw errors.INTERNAL_SERVER(messages.error.WRITING_FILE);
    }
  }
};

export { modifyFile };
