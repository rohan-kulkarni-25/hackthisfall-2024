import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  loginCreator,
  logoutUser,
  registerCreator,
} from "./../controllers/creator.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerCreator
);
router.route("/login").post(loginCreator);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
