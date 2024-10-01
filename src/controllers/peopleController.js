import { dirPath } from '../server.js';
import { getFileData } from '../utils/getFileData.js';

const getAllPeople = async () => {
  try {
    const filePath = dirPath.concat('/people/people-data.json');
    const peopleData = await getFileData(filePath);
    return peopleData;
  } catch (error) {
    throw error;
  }
};
export { getAllPeople };
