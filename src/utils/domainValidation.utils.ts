import { DNS_ERROR_CODES } from '../constants/checkDns.constants.js';
import { checkDns } from './checkDns.utils.js';

export const domainValidation = async (domain: string): Promise<boolean> => {
  try {
    const mxRecords = await checkDns(domain);
    return mxRecords.length > 0;
  } catch (error) {
    const errorWithCode = error as Error & { code?: string };
    if (errorWithCode.code === DNS_ERROR_CODES.NOT_FOUND) {
      return false;
    }
    throw error;
  }
};
