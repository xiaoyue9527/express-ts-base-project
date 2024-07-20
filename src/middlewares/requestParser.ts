import express, { Express } from "express";

export const requestParserMiddleware = (app: Express) => {
  app.use(express.json()); // 解析 JSON 格式的请求体
  app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体
};
