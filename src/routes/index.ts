import { Express, Request, Response, Router } from "express";
import authRouter from "./api/authRouter";
import logger from "../logger";
import userRouter from "./api/userRouter";

interface RouterConf {
  path: string;
  router: Router;
  meta?: any;
}

const routerGroup: RouterConf[] = [
  { path: "/api/auth", router: authRouter },
  { path: "/api/user", router: userRouter },
];

function registerRouteGroup(app: Express, routes: RouterConf[]) {
  routes.forEach((route) => {
    app.use(route.path, route.router);
  });
}

function initRoutes(app: Express) {
  logger.info("Router initialization");

  app.get("/", (req: Request, res: Response) => {
    logger.info("This is an info message");
    logger.warn("This is a warning message");
    logger.error("This is an error message");
    res.send("Hello, Object Storage System!");
  });

  registerRouteGroup(app, routerGroup);
}

export default initRoutes;
