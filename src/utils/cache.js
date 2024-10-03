import nodeCache from 'node-cache';
import { messages, errors } from '../utils/errorHandler.js';

const cacheOptions = {
  stdTTL: 3600,
  checkPeriod: 600,
  useClones: false,
  maxKeys: 100,
};

const createCacheService = cache => {
  const saveToCache = (key, file) => {
    if (!key || !file) {
      throw errors.BAD_REQUEST(messages.error.CACHE_DATA_EMPTY);
    }
    return cache.set(key, file);
  };

  const getFromCache = key => {
    if (!key) {
      throw errors.BAD_REQUEST(messages.error.CACHE_KEY_EMPTY);
    }
    return cache.get(key);
  };

  const clearCache = key => {
    if (!key) {
      throw errors.BAD_REQUEST(messages.error.CACHE_KEY_EMPTY);
    }
    return cache.del(key);
  };

  return {
    saveToCache,
    getFromCache,
    clearCache,
  };
};

const cache = new nodeCache(cacheOptions);
const cacheService = createCacheService(cache);

export { cacheService };
