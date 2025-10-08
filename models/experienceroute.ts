import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
    Title:string;
    start:string;
    end:string;
    details:string;

}

const experienceschema = new mongoose.Schema<IUser>(
  {
    Title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    details: { type: String, required: true },
  }

);

const Experience: Model<IUser> = mongoose.models.Experience || mongoose.model<IUser>("Experience", experienceschema);

export default Experience;
