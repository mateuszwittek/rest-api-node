import nodeCache from 'node-cache';

const createCache = () => new nodeCache();

const createCacheService = (cache) => ({
    saveToCache: (key, file) => cache.set(key, file),
    getFromCache: (key) => cache.get(key)
});

const cache = createCache()
const cacheService = createCacheService(cache);

export { cacheService };