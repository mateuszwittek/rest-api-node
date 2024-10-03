import config from '../../config/config.js';
import { messages, errors } from './errorHandler.js';

const { rootPath } = config;
const getFileDir = relativePath => {
  if (!relativePath) {
    throw errors.BAD_REQUEST(messages.error.REL_PATH_REQUIRED);
  }

  return rootPath.concat(relativePath);
};

export { getFileDir };
