import { Router } from "express";

import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/AuthController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.post("/register", UserController.store);
routes.post("/auth", AuthController.store);

routes.use(authMiddleware);

routes.get("/register", UserController.index);

export default routes;
