import fs from 'node:fs/promises';
import { messages, errors } from '../utils/errorHandler.js';

const getFile = async filePath => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    switch (error.code) {
      case 'ENOENT':
        throw errors.NOT_FOUND();
      case 'EACCES':
        throw errors.FORBIDDEN();
      case 'EISDIR':
        throw errors.BAD_REQUEST();
      default:
        throw errors.INTERNAL_SERVER(messages.error.FILE_PROCESSING);
    }
  }
};

export { getFile };
