import { Request, Response, NextFunction } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";



export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return response.unauthorize(res)
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return response.unauthorize(res)
  }

  const user = getUserData(token);

  if (!user) {
    return response.unauthorize(res)
  }

  (req as IReqUser).user = user;

  next();
};
