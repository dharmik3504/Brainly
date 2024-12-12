import express from "express";
import { User } from "./db";
import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());
const JWT_PASSWORD = "hdhdhdhkakielejdjfnjnfek";
app.post("/api/v1/signup", async (req, res) => {
  const requestBodyObj = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
  });
  const isRequestBodyObjValid = requestBodyObj.safeParse(req.body);
  if (isRequestBodyObjValid.success) {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    try {
      const data = await User.create({
        username,
        password: hashedPassword,
      });
      if (data) {
        res
          .status(200)
          .json({ message: "user has created now you can login in" });
      } else {
        res.status(401).json({ message: "something went wrong" });
      }
    } catch (e: any) {
      res.status(401).json({ message: e.message });
    }
  } else {
    res.status(411).json({ isRequestBodyObjValid });
  }
});
app.post("/api/v1/signin", async (req, res) => {
  const requestBodyObj = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(3).max(20),
  });
  //   type requestBodyObjType = z.infer<typeof requestBodyObj>;
  const isRequestBodyObjValid = requestBodyObj.safeParse(req.body);
  if (isRequestBodyObjValid.success) {
    const { username, password } = req.body;
    const isUserNameExit = await User.findOne({ username });
    if (!isUserNameExit) {
      res.send({ mesage: "Invalid user" });
      return;
    }
    const checkHashPasword = await bcrypt.compare(
      password,
      isUserNameExit?.password ? isUserNameExit?.password : ""
    );
    if (checkHashPasword) {
      const token = jwt.sign({ id: isUserNameExit._id }, JWT_PASSWORD);
      res.json({ token });
    } else {
      res.json({
        message: "incorrect credentials",
      });
    }
  } else {
    res.status(411).json({ isRequestBodyObjValid });
  }
});
app.post("/api/v1/content", async (req, res) => {});
app.get("/api/v1/content", async (req, res) => {});

app.delete("/api/v1/content", async (req, res) => {});
app.post("/api/v1/brain/share", async (req, res) => {});

app.get("/api/v1/brain/:shareLink", async (req, res) => {});

app.listen(3000);
