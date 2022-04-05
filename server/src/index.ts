import "reflect-metadata";
import express from "express";
import DatabaseConnection from "./database-connection";
import callsRouter from "./controller/call.controller";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/calls", callsRouter);

app.listen(port, async () => {
  await DatabaseConnection.initialize();
  console.log(`Server listening on port: ${port}`);
});
