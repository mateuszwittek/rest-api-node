import nodeCache from 'node-cache';

const cacheOptions = {
  stdTTL: 3600,
  checkPeriod: 600,
  useClones: false,
  maxKeys: 100,
};

const createCacheService = cache => {
  const saveToCache = (key, file) => {
    if (!key || !file) {
      throw new Error('Key and file must be provided');
    }
    return cache.set(key, file);
  };

  const getFromCache = key => {
    if (!key) {
      throw new Error('Key must be provided');
    }
    return cache.get(key);
  };

  const clearCache = key => {
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
