import config from '../../config/config.js';

const { rootPath } = config;
const getFileDir = relativePath => rootPath.concat(relativePath);

export { getFileDir };
