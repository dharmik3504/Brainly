import express from "express";
import { ContentModel, LinkModel, User } from "./db";
import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { middleware } from "./auth";
import { random } from "./utils";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.post("/api/v1/signup", async (req, res) => {
  console.log(req.body);
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
app.post("/api/v1/content", middleware, async (req, res) => {
  const contentTypes = [
    "image",
    "video",
    "article",
    "audio",
    "Youtube",
    "Twitter",
  ] as const;
  const requestBodyObj = z.object({
    link: z.string().min(3),
    type: z.enum(contentTypes),
    title: z.string().min(3),
  });
  const requestHeader = z.object({
    token: z.string().min(3),
  });
  //   type requestBodyObjType = z.infer<typeof requestBodyObj>;
  const isRequestBodyObjValid = requestBodyObj.safeParse(req.body);
  if (isRequestBodyObjValid.success) {
    const { link, type, title } = req.body;
    //@ts-ignore
    const { userId } = req;
    await ContentModel.create({
      link,
      type,
      title,
      userId,
      tag: [],
    });
    res.json({
      message: "Content Added",
    });
  } else {
    res.status(411).json({ isRequestBodyObjValid });
  }
});
app.get("/api/v1/content", middleware, async (req, res) => {
  //   @ts-ignore
  const userId = req.userId;
  const contents = await ContentModel.find({ userId }).populate(
    "userId",
    "username"
  );
  res.json({
    contents,
  });
});

app.delete("/api/v1/content", middleware, async (req, res) => {
  const { contentId } = req.body;
  try {
    const deleteContent = await ContentModel.deleteMany({
      _id: contentId,
      // @ts-ignore
      userId: req.userId,
    });
    res.json({ mesaage: "deleted" });
  } catch (e: any) {
    res.json(e.message);
  }
});
app.post("/api/v1/brain/share", middleware, async (req, res) => {
  const { share } = req.body;
  if (share) {
    const existingLink = await LinkModel.findOne({
      // @ts-ignore
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }

    const hash = random(10);
    const link = await LinkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash,
    });
    res.json({ message: `/share/${hash}` });
  } else {
    await LinkModel.deleteMany({
      // @ts-ignore
      user: req.userId,
    });
    res.json({ message: "Removed Link" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const { shareLink } = req.params;
  const link = await LinkModel.findOne({
    hash: shareLink,
  });
  if (!link) {
    res.json({
      message: "incorrect input",
    });
    return;
  }
});

app.listen(3000);
