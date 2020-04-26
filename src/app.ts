import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { index, parseRecipeHandler } from "./controllers";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "pug");

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get("/", index);
app.get("/parse_recipe", parseRecipeHandler);

export default app;
