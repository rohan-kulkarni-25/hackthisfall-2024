import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes declaration

import creatorRouter from "./routes/creators.routes.js";
import articleRouter from "./routes/articles.routes.js";

app.use("/api/v1/creator", creatorRouter);
app.use("/api/v1/article", articleRouter);

export { app };
