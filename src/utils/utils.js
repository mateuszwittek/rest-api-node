import path from 'node:path';
import messages from './messages.js';
import { errors } from './errorHandler.js';

const getFileName = filePath => {
  if (filePath === null || filePath === undefined) {
    throw errors.BAD_REQUEST(messages.error.MISSING_FILE_PATH);
  }

  const normalizedPath = path.normalize(filePath);
  const fileName = path.basename(normalizedPath, path.extname(normalizedPath));

  if (fileName === null || fileName === undefined) {
    throw errors.BAD_REQUEST(messages.error.INVALID_FILE_PATH);
  }

  return fileName;
};

const validJSON = data => {
  if (typeof data !== 'string') {
    throw errors.BAD_REQUEST(messages.error.INPUT_MUST_BE_STRING);
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw errors.BAD_REQUEST(messages.error.INVALID_JSON);
    } else {
      throw errors.INTERNAL_SERVER(messages.error.FILE_PROCESSING);
    }
  }
};

export { validJSON, getFileName };
