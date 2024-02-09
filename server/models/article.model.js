import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema(
  {
    creatorId: {
      type: Schema.ObjectId,
      ref: "Creator",
    },
    collaboratorId: {
      type: Schema.ObjectId,
      ref: "Creator",
    },
    text: {
      type: String,
    },
    tone: {
      type: String,
    },
    platform: {
      type: String,
    },
    useCase: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.model("Article", articleSchema);
