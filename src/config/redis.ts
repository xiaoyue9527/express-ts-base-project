import Redis from "ioredis";
import { getConfig } from "./config";

const redis = new Redis(getConfig().redis);

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

export default redis;
