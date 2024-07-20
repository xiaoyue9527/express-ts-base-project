import { CustomError } from './customError';

// 服务器内部错误
export class ServerInternalError extends CustomError {
    constructor(errorCode: number = 600000, message?: string) {
        super(errorCode, message || 'Server internal error occurred.');
    }
}

// 数据库连接错误
export class DbConnectionError extends ServerInternalError {
    constructor(message?: string) {
        super(100101, message || 'Database connection error.');
    }
}

// MySQL 连接错误
export class DbMySqlConnectionError extends ServerInternalError {
    constructor(message?: string) {
        super(100101, message || 'MySQL connection error.');
    }
}

// Redis 连接错误
export class DbRedisConnectionError extends ServerInternalError {
    constructor(message?: string) {
        super(100201, message || 'Redis connection error.');
    }
}

// 数据库查询错误
export class DbQueryError extends ServerInternalError {
    constructor(message?: string) {
        super(600200, message || 'Database query error.');
    }
}

// 认证失败错误
export class AuthenticationError extends ServerInternalError {
    constructor(message?: string) {
        super(600300, message || 'Authentication failed.');
    }
}

// 授权失败错误
export class AuthorizationError extends ServerInternalError {
    constructor(message?: string) {
        super(600400, message || 'Authorization failed.');
    }
}

// 支付处理错误
export class PaymentProcessingError extends ServerInternalError {
    constructor(message?: string) {
        super(600500, message || 'Payment processing error.');
    }
}

// 订单处理错误
export class OrderProcessingError extends ServerInternalError {
    constructor(message?: string) {
        super(600600, message || 'Order processing error.');
    }
}

// 客户端错误
export class ClientError extends CustomError {
    constructor(errorCode: number, message?: string) {
        super(errorCode, message);
    }
}

// 错误的客户端请求
export class ClientBadRequestError extends ClientError {
    constructor(message?: string) {
        super(400, message || 'Bad request from client.');
    }
}

// 客户端被风控
export class ClientForbiddenByRiskControlError extends CustomError {
    constructor(message?: string) {
        super(403, message || 'Client is forbidden by risk control.');
    }
}

// 未经授权的客户端请求
export class ClientUnauthorizedError extends ClientError {
    constructor(message?: string) {
        super(401, message || 'Unauthorized client request.');
    }
}

// 客户端权限不足
export class ClientForbiddenError extends ClientError {
    constructor(message?: string) {
        super(403, message || 'Client does not have sufficient permissions.');
    }
}

// 客户端数据验证失败
export class ClientValidationError extends ClientError {
    constructor(message?: string) {
        super(422, message || 'Client data validation failed.');
    }
}

// 客户端请求超时
export class ClientTimeoutError extends ClientError {
    constructor(message?: string) {
        super(408, message || 'Client request timed out.');
    }
}

// 客户端提供的凭证无效
export class ClientInvalidCredentialsError extends ClientError {
    constructor(message?: string) {
        super(401, message || 'Invalid credentials provided by client.');
    }
}

// 客户端请求过多
export class ClientTooManyRequestsError extends ClientError {
    constructor(message?: string) {
        super(429, message || 'Too many requests from client.');
    }
}

// 客户端网络连接错误
export class ClientNetworkError extends ClientError {
    constructor(message?: string) {
        super(500, message || 'Client network connection error.');
    }
}