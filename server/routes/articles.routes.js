import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createArticle } from "../controllers/article.controller.js";

const router = Router();

//secured routes
router.route("/create").post(verifyJWT, createArticle);

export default router;
