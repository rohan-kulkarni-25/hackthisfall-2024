import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Creator } from "../models/creators.model.js";
import { APIError } from "../utils/APIError.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new APIError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const creator = await Creator.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!creator) {
      throw new APIError(401, "Invalid Access Token");
    }

    req.creator = creator;
    next();
  } catch (error) {
    throw new APIError(401, error?.message || "Invalid access token");
  }
});
