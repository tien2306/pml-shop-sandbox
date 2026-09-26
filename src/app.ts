import "dotenv/config"; // require("dotenv").config();
import express from "express"; //const epress = require("express")
import path from "path"; // const path = require("path");
import webRoutes from "./routes/web";
import initDatabase from "config/seed";

// bước chuẩn bị
const app = express();
const PORT = process.env.PORT || 8000;

//config view agine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// config req.body
// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));
// Optional: If you send data via JSON (e.g., via Fetch API/Axios instead of a standard form submit)
app.use(express.json());

//config static file: image/css/js
app.use(express.static("public"));

//config route
webRoutes(app);

//seeding data
initDatabase();

// bước chạy server
app.listen(PORT, () => {
  console.log(`My app is running on port ${PORT}, ${__dirname}`);
});
