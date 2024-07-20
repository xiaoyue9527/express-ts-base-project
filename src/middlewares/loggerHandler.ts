import morgan, { StreamOptions } from 'morgan';
import logger from '../logger';

// 创建一个流对象，用于将 morgan 的日志输出到 winston
const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

// 配置 morgan 中间件
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

export default morganMiddleware;
