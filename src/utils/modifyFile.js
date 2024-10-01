import fs from 'node:fs/promises';

const modifyFile = async (filePath, content) => await fs.writeFile(filePath, content);

export { modifyFile };
