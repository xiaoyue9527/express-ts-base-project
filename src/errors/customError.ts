// src/errors/customError.ts
export class CustomError extends Error {
  public errorCode: number;

  constructor(errorCode: number, message?: string) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    console.log(this.errorCode, "base", message);
    // 捕获当前错误的堆栈信息，以便调试
    Error.captureStackTrace(this, this.constructor);
  }
}
