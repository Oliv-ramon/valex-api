import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/router.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(router)

app.listen(process.env.PORT, () => {
  console.log(`running on ${process.env.PORT}`);
})