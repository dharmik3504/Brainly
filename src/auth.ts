import jwt from "jsonwebtoken";
import z from "zod";

export const auth = (req, res, next) => {
  const JWT_PASSWORD = "hdhdhdhkakielejdjfnjnfek";

  const requestBodyObj = z.object({
    token: z.string(),
  });
  const isRequestBodyObjValid = requestBodyObj.safeParse(req.body);
  if (isRequestBodyObjValid.success) {
    const { token } = req.headers;
    const verifyToken = jwt.verify(token, JWT_PASSWORD);
    if (verifyToken) {
      req.userId = verifyToken;
      next();
    } else {
      res.json({ message: "user is not valid please sign in again" });
    }
  } else {
    res.status(411).json({ isRequestBodyObjValid });
  }
};
