import cors from "cors";
import express from "express";
import { router } from "./route.js";
import { initWebSocket } from "./ws.js";
const app = express();

const corsOptions = {
    origin:'*', 
 };

app.use(cors(corsOptions)); 
 
app.listen(8080,() => {
  console.log("app up and running")
});

initWebSocket();
app.use("/game", router);
