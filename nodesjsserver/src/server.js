import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import connection from "./config/connectDB";
import configCors from "./config/cors";
require("dotenv").config();
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 8080;

configCors(app);
configViewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connection();
initWebRoutes(app);
initApiRoutes(app);
app.listen(PORT, () => {
  console.log(">>>Backend is running on port  " + PORT);
});
