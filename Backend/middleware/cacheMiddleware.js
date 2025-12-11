import { getCache, setCache, deleteCachePattern } from '../config/redis.js';

/**
 * 🚀 PERFORMANCE: Advanced caching middleware with Redis support
 * Automatically falls back to in-memory cache if Redis unavailable
 */
export const redisCacheMiddleware = (ttlSeconds = 30) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = `cache:${req.originalUrl}`;

        try {
            // Try to get from cache
            const cached = await getCache(cacheKey);

            if (cached) {
                console.log(`✅ Cache HIT: ${req.originalUrl}`);
                return res.json(cached);
            }

            console.log(`❌ Cache MISS: ${req.originalUrl}`);

            // Override res.json to cache the response
            const originalJson = res.json.bind(res);
            res.json = async (data) => {
                // Cache the response
                await setCache(cacheKey, data, ttlSeconds);
                return originalJson(data);
            };

            next();
        } catch (err) {
            console.error('Cache middleware error:', err);
            next();
        }
    };
};

/**
 * Clear cache for specific contest
 */
export const clearContestCache = async (contestId) => {
    await deleteCachePattern(`cache:*${contestId}*`);
    console.log(`🗑️  Cleared cache for contest: ${contestId}`);
};

/**
 * Clear cache for user wallet
 */
export const clearWalletCache = async (uid) => {
    await deleteCachePattern(`cache:*wallet*${uid}*`);
    console.log(`🗑️  Cleared wallet cache for user: ${uid}`);
};

export default { redisCacheMiddleware, clearContestCache, clearWalletCache };
