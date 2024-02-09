import { Article } from "../models/article.model.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createArticle = asyncHandler(async (req, res) => {
  const { creatorId } = req.creator;
  if (!creatorId) {
    throw new APIError(400, "Creator ID is required to create article.");
  }

  const article = await Article.create({
    creatorId,
  });

  if (!article) {
    throw new APIError(400, "Article not created ! Something went wrong");
  }

  res
    .status(200)
    .json(new APIResponse(200, article, "Article Created Sucessfully"));
});

export { createArticle };
