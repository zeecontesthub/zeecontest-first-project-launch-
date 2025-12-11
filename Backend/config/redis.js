import Redis from 'ioredis';

// Create Redis client with fallback to in-memory cache if Redis unavailable
let redis = null;
let useRedis = false;

try {
    redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
            if (times > 3) {
                console.warn('⚠️  Redis unavailable, falling back to in-memory cache');
                return null; // Stop retrying
            }
            return Math.min(times * 50, 2000);
        },
    });

    redis.on('connect', () => {
        console.log('✅ Connected to Redis cache');
        useRedis = true;
    });

    redis.on('error', (err) => {
        console.warn('⚠️  Redis error, using in-memory cache:', err.message);
        useRedis = false;
    });
} catch (err) {
    console.warn('⚠️  Redis initialization failed, using in-memory cache');
}

// Fallback in-memory cache
const memoryCache = new Map();

/**
 * Get value from cache (Redis or memory)
 */
export const getCache = async (key) => {
    try {
        if (useRedis && redis) {
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        }

        // Fallback to memory cache
        const cached = memoryCache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.data;
        }
        return null;
    } catch (err) {
        console.error('Cache get error:', err);
        return null;
    }
};

/**
 * Set value in cache (Redis or memory)
 */
export const setCache = async (key, value, ttlSeconds = 30) => {
    try {
        if (useRedis && redis) {
            await redis.setex(key, ttlSeconds, JSON.stringify(value));
        } else {
            // Fallback to memory cache
            memoryCache.set(key, {
                data: value,
                timestamp: Date.now(),
                ttl: ttlSeconds * 1000,
            });
        }
    } catch (err) {
        console.error('Cache set error:', err);
    }
};

/**
 * Delete value from cache
 */
export const deleteCache = async (key) => {
    try {
        if (useRedis && redis) {
            await redis.del(key);
        } else {
            memoryCache.delete(key);
        }
    } catch (err) {
        console.error('Cache delete error:', err);
    }
};

/**
 * Delete all keys matching pattern
 */
export const deleteCachePattern = async (pattern) => {
    try {
        if (useRedis && redis) {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } else {
            // Memory cache pattern matching
            for (const key of memoryCache.keys()) {
                if (key.includes(pattern.replace('*', ''))) {
                    memoryCache.delete(key);
                }
            }
        }
    } catch (err) {
        console.error('Cache pattern delete error:', err);
    }
};

/**
 * Clear all cache
 */
export const clearAllCache = async () => {
    try {
        if (useRedis && redis) {
            await redis.flushdb();
        } else {
            memoryCache.clear();
        }
        console.log('🗑️  Cache cleared');
    } catch (err) {
        console.error('Cache clear error:', err);
    }
};

export default redis;
