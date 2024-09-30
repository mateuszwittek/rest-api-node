import path from 'node:path';

const getFileName = filePath => {
    if (typeof filePath !== 'string' || filePath.length === 0) {
      throw new Error('Invalid file path');
    }
    const normalizedPath = path.normalize(filePath);
    return path.basename(normalizedPath, path.extname(normalizedPath));
};

const validJSON = (data) => {
  if (typeof data !== 'string') {
    throw new Error('Input data must be a string');
  }

  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON syntax');
    } else {
      throw new Error('The provided file is not a JSON file');
    }
  }
};


export {validJSON, getFileName}