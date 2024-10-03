import { messages, errors } from './errorHandler.js';

const generateNewID = data => {
  if (!Array.isArray(data) || data.length === 0) {
    throw errors.BAD_REQUEST(messages.error.NOT_EMPTY_ARRAY);
  }

  const ids = data.map(item => {
    if (typeof item.id !== 'number') {
      throw errors.BAD_REQUEST(messages.error.INVALID_ID);
    }

    return item.id;
  });

  return Math.max(...ids) + 1;
};

export { generateNewID };
