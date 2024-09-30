import fs from 'node:fs/promises';

const getFile = async filePath => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    switch (error.code) {
      case 'ENOENT':
        console.error(`File not found`);
        throw new Error(`File not found`);
      case 'EACCES':
        console.error(`Permission denied`);
        throw new Error(`Permission denied`);
      case 'EISDIR':
        console.error(`Path is a directory, not a file`);
        throw new Error(`Path is a directory, not a file`);
      default:
        console.error(`Error processing file:`, error);
        throw new Error('Error processing file');
    }
  }
};

export { getFile };
