// config.ts
import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import logger from "../logger";
import { ConnectOptions } from "mongoose";
import { RedisOptions } from "ioredis";

// 定义数据库配置接口
interface DatabaseConfig {
  url: string;
  options: ConnectOptions;
}

// 定义基础配置接口
interface Config {
  APP: {
    name: string;
    port: number;
    host: string;
  };
  jwt_secret: string;
  cors: CorsConfig;
  rateLimit: RateLimitConfig;
  database: DatabaseConfig;
  redis: RedisOptions;
}

// 跨域配置接口
interface CorsConfig {
  origin: boolean | string | RegExp | Array<string | RegExp>;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
}

// 请求限流配置接口
interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  customHeader?: string;
}

// 扩展配置接口，允许任意类型的额外属性
interface ExtendedConfig extends Config, Record<string, any> {}

// 配置缓存变量，用于存储已加载的配置
let configCache: ExtendedConfig | null = null;

// 获取当前环境变量，默认为 'dev'
export const getEnv = (): string => {
  return process.env.RUNNING_ENV ?? "dev";
};

/**
 * 获取配置对象或特定配置类型
 * @param type - 配置类型的键
 * @returns 如果传入了type参数，则返回对应的配置类型，否则返回完整的配置对象
 */
export function getConfig(): ExtendedConfig;
export function getConfig<T extends keyof Config>(type: T): Config[T];
export function getConfig<T extends keyof Config>(
  type?: T
): Config[T] | ExtendedConfig {
  const environment = getEnv(); // 获取当前运行环境

  // 如果已经缓存了配置，直接返回缓存中的值
  if (configCache != null) {
    return type !== undefined ? configCache[type] : configCache;
  }

  try {
    // 根据环境变量构建配置文件路径
    const yamlPath = join(process.cwd(), `.config/.${environment}.yaml`);
    // 读取配置文件内容
    const file = readFileSync(yamlPath, "utf8");
    // 解析YAML格式的配置文件
    const parsedConfig = parse(file) as ExtendedConfig;
    configCache = parsedConfig; // 将解析后的配置缓存起来
    return type !== undefined ? parsedConfig[type] : parsedConfig;
  } catch (error: any) {
    // 处理读取或解析配置文件时的错误
    logger.error(`Failed to read or parse the config file: ${error}`);
    process.exit(1); // 出错时终止程序，或者可以选择抛出异常或返回默认配置
  }
}
