// src/utils/cache.ts
import redis from '../config/redis';

export const setCache = async (key: string, value: any, ttl: number) => {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const delCache = async (key: string) => {
  await redis.del(key);
};
