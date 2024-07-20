// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import { CustomError } from "../errors/customError";

// 错误处理器中间件
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("--------------------------", err.errorCode);
  // 检查错误是否是自定义错误类型
  if (err instanceof CustomError) {
    // 记录错误信息，包括请求方法、URL、错误信息和错误代码
    logger.error(
      `${req.method} ${req.url} - ${err.message} - Code: ${err.errorCode}`
    );

    // 根据错误代码返回不同的响应状态码和消息
    res.status(err.errorCode > 1000 ? 500 : err.errorCode).json({
      message: err.errorCode > 1000 ? "Server error" : err.message,
      code: err.errorCode,
    });
  } else {
    // 如果不是自定义错误，记录通用错误信息
    logger.error(`${req.method} ${req.url} - ${err.message}`);

    // 返回通用的服务器错误响应
    res.status(500).json({
      message: "Server error",
      code: 500,
    });
  }

  // 调用下一个中间件
  next();
};

export default errorHandler;
