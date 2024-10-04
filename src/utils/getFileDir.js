import config from '../../config/config.js';
import { errors } from './errorHandler.js';
import messages from './messages.js';

const { rootPath } = config;
const getFileDir = relativePath => {
  if (!relativePath) {
    throw errors.BAD_REQUEST(messages.error.REL_PATH_REQUIRED);
  }

  return rootPath.concat(relativePath);
};

export { getFileDir };
