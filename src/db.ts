import mongoose, { Types } from "mongoose";
import { MONGODB_URL } from "./config";
const { Schema, model, connect } = mongoose;

const contentTypes = ["image", "video", "article", "audio"];
connect(MONGODB_URL);
const UserSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

const TagSchema = new Schema({
  title: { type: String, require: true, unique: true },
});

const ContentSchema = new Schema({
  link: { type: String, require: true },
  type: { type: String, require: true, emum: contentTypes },
  title: { type: String, require: true },
  tag: [{ type: Types.ObjectId, ref: "Tag" }],
  userId: { type: Types.ObjectId, ref: "User", require: true },
});

const LinkSchema = new Schema({
  hash: { type: String, require: true },
  userId: { type: Types.ObjectId, ref: "User", require: true, unique: true },
});

export const User = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
export const TagModel = model("Tag", TagSchema);
export const LinkModel = model("Link", LinkSchema);
