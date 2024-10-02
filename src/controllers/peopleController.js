import { getFileData } from '../utils/getFileData.js';
import { getFileDir } from '../utils/getFileDir.js';

const getAllPeople = async () => {
  try {
    const filePath = getFileDir('/people-data.json');
    console.log('filepath value: ', filePath);
    const peopleData = await getFileData(filePath);
    return peopleData;
  } catch (error) {
    throw error;
  }
};
export { getAllPeople };
