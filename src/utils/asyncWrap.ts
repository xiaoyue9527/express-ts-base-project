import { Request, Response, NextFunction } from 'express';

/**
 * 异步包装函数，用于将异步中间件函数转换为符合 Express 标准的中间件函数。
 * @param fn 异步中间件函数
 * @returns 转换后的中间件函数
 */
const asyncWrap = (fn: (req: Request, res: Response, next: NextFunction, ...args: any[]) => Promise<any>) =>
    function asyncUtilWrap(req: Request, res: Response, next: NextFunction, ...args: any[]) {
        const fnReturn = fn(req, res, next, ...args);
        return Promise.resolve(fnReturn).catch(next);
    };

export default asyncWrap;