// src/cache/auth.ts
import redis from "../config/redis";

export const incrementLoginAttempts = async (key: string, ttl: number): Promise<number> => {
    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, ttl);
    }
    return attempts;
  };
  
  export const resetLoginAttempts = async (key: string): Promise<void> => {
    await redis.del(key);
  };
  