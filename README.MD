# Express + TypeScript 基础项目模块搭建指南

## 项目简介

这是一个基于 Express 和 TypeScript 的基础项目，包含了配置管理、日志处理、错误处理、数据库连接、路由定义、用户认证和缓存等多个模块。通过这个项目，你可以快速搭建一个功能完备的 Web 应用。

## 目录结构

```markdown
BaseProject/express
├── .config                 # 配置文件目录
├── logs                    # 日志文件目录
│   ├── combined.log        # 组合日志文件
│   ├── error.log           # 错误日志文件
│   └── http.log            # HTTP 请求日志文件
├── node_modules            # 项目依赖模块
├── script                  # 脚本文件目录
│   └── i_db.sh             # 数据库初始化脚本
├── src                     # 源代码目录
│   ├── cache               # 缓存模块
│   │   └── auth.ts         # 认证缓存工具
│   ├── config              # 配置模块
│   │   ├── config.ts       # 配置管理
│   │   ├── database.ts     # 数据库连接配置
│   │   ├── redis.ts        # Redis 连接配置
│   │   └── swagger.ts      # Swagger 配置
│   ├── controllers         # 控制器模块
│   │   └── user            # 用户相关控制器
│   │       ├── authController.ts    # 用户认证控制器
│   │       ├── infoController.ts    # 用户信息控制器
│   │       └── securityController.ts # 用户安全控制器
│   ├── errors              # 错误处理模块
│   │   ├── customError.ts  # 自定义错误类
│   │   └── index.ts        # 错误类型定义
│   ├── index.ts            # 应用入口文件
│   ├── logger              # 日志模块
│   │   └── index.ts        # 日志配置
│   ├── middlewares         # 中间件模块
│   │   ├── authMiddleware.ts     # 认证中间件
│   │   ├── corsMiddleware.ts     # CORS 中间件
│   │   ├── errorHandler.ts       # 错误处理中间件
│   │   ├── helmet.ts             # 安全头中间件
│   │   ├── index.ts              # 中间件初始化
│   │   ├── loggerHandler.ts      # 日志中间件
│   │   ├── rateLimit.ts          # 请求限流中间件
│   │   ├── requestParser.ts      # 请求解析中间件
│   │   ├── roleMiddleware.ts     # 角色验证中间件
│   │   └── swagger.ts            # Swagger 中间件
│   ├── models              # 数据模型
│   │   ├── UserModel.ts    # 用户模型
│   │   └── baseModel.ts    # 基础模型
│   ├── routes              # 路由模块
│   │   ├── api             # API 路由
│   │   │   ├── authRouter.ts # 认证路由
│   │   │   └── userRouter.ts # 用户路由
│   │   └── index.ts        # 路由初始化
│   ├── types               # 类型定义
│   │   └── user.ts         # 用户相关类型
│   └── utils               # 工具模块
│       ├── asyncWrap.ts    # 异步包装工具
│       └── cache.ts        # 缓存工具
├── .env                    # 环境变量文件
├── .eslintrc.js            # ESLint 配置文件
├── docker-compose.yaml     # Docker Compose 配置文件
├── package-lock.json       # 锁定依赖版本的文件
├── package.json            # 项目依赖和脚本配置文件
├── README.md               # 项目说明文件
├── tsconfig.json           # TypeScript 配置文件
```

## 安装和运行

### 1. 克隆项目

```bash
git clone https://github.com/xiaoyue9527/express-ts-base-project.git
cd express-ts-base-project
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录下创建 `.env` 文件，并添加以下内容：

```
RUNNING_ENV=dev
```

### 4. 启动项目

```bash
npm run dev
```

> 用默认数据库配置需要先`docker-compose up -d`创建MongoDB、Redis

## 模块说明

### 配置管理

配置管理模块负责加载和管理应用的各种配置，包括环境变量和配置文件。

- 目录：`src/config`
- 主要文件：`config.ts`

### 日志模块

日志模块使用 `winston` 和 `morgan` 记录请求日志和应用日志。

- 目录：`src/logger`
- 主要文件：`index.ts`

### 错误处理

全局错误处理模块捕获和处理应用中的所有错误，并返回统一的错误响应格式。

- 目录：`src/middlewares`
- 主要文件：`errorHandler.ts`

### 数据库连接

使用 `mongoose` 进行 MongoDB 连接和管理。

- 目录：`src/config`
- 主要文件：`database.ts`

### 缓存模块

使用 `ioredis` 实现 Redis 缓存。

- 目录：`src/config`, `src/utils`
- 主要文件：`redis.ts`, `cache.ts`

### 路由定义

路由模块定义了应用的各种路由和控制器。

- 目录：`src/routes`, `src/controllers`
- 主要文件：`index.ts`, `authRouter.ts`, `userRouter.ts`

### 用户和验证授权

用户模块包含用户注册、登录、信息获取和密码重置等功能。

- 目录：`src/models`, `src/controllers/user`
- 主要文件：`UserModel.ts`, `authController.ts`, `infoController.ts`, `securityController.ts`

### 中间件支持

支持请求解析、CORS、安全头、请求限流等中间件。

- 目录：`src/middlewares`
- 主要文件：`requestParser.ts`, `corsMiddleware.ts`, `helmet.ts`, `rateLimit.ts`

## 许可证

本项目基于 MIT 许可证，详细信息请参阅 [LICENSE](LICENSE) 文件。