import { dirPath } from '../server.js';

const getFileDir = relativePath => dirPath.concat(relativePath);

export { getFileDir };
