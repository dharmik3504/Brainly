import express from "express";
import { User } from "./db";
import z from "zod";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());

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
app.post("/api/v1/signin", async (req, res) => {});
app.post("/api/v1/content", async (req, res) => {});
app.get("/api/v1/content", async (req, res) => {});

app.delete("/api/v1/content", async (req, res) => {});
app.post("/api/v1/brain/share", async (req, res) => {});

app.get("/api/v1/brain/:shareLink", async (req, res) => {});

app.listen(3000);
