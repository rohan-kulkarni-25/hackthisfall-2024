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

app.use("/api/v1/creators", creatorRouter);
// http://localhost:8000/api/v1/users/register

export { app };
