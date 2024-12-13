import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { JWT_PASSWORD } from "./config";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const requestBodyObj = z.object({
    token: z.string(),
  });
  const isRequestBodyObjValid = requestBodyObj.safeParse(req.headers);
  if (isRequestBodyObjValid.success) {
    const { token } = req.headers;

    const verifyToken = jwt.verify(token as string, JWT_PASSWORD);
    if (verifyToken) {
      //@ts-ignore
      req.userId = verifyToken.id;
      next();
    } else {
      res
        .status(403)
        .json({ message: "user is not valid please sign in again" });
    }
  } else {
    res.status(411).json({ isRequestBodyObjValid });
  }
};
