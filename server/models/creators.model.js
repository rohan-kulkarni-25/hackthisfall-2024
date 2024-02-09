import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const creatorSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowecase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
      index: true,
    },
    isCollaborator: {
      type: Boolean,
    },
    avatar: {
      type: String, // cloudinary url
    },
    socials: [
      {
        type: String,
      },
    ],
    showCases: [
      {
        type: Schema.ObjectId,
        ref: "Article",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

creatorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

creatorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

creatorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
creatorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Creator = mongoose.model("Creator", creatorSchema);
