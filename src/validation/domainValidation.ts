import { DNS_ERROR_TYPES } from '../constants/checkDns.constants.js';
import { checkDns } from '../utils/checkDns.utils.js';

export const domainValidation = async (domain: string): Promise<boolean> => {
  try {
    const mxRecords = await checkDns(domain);
    return mxRecords.length > 0;
  } catch (error) {
    if (error instanceof Error && error.name === DNS_ERROR_TYPES.DOMAIN_NOT_FOUND) {
      return false;
    }
    throw error;
  }
};

export default domainValidation;
