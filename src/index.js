import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import * as path from "path";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import FileStore from 'session-file-store'


import ProductRouter from "./router/product.routes.js";
import cartRouter from "./router/cart.routes.js";
import sessionRouter from "./router/sessions.routes.js";

// Express
const app = express();
const PORT = 8080;
const filestore = FileStore(session)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));
app.use("/", express.static(__dirname + "/public"));
app.engine('handlebars', engine({partialsDir: __dirname + '/views/partials'}))

// Mongoose
const environment = async () => {
  await mongoose
    .connect(
      "mongodb+srv://velezwiesner:8FxbISA9qJksWzmM@cluster0.bn5gi6q.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      throw Error(`Error connecting to database ${error}`);
    });
};

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
      "mongodb+srv://velezwiesner:8FxbISA9qJksWzmM@cluster0.bn5gi6q.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 1000,
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialized: false,
  })
  );
  
  environment();
// Routes
app.use("/api/products", ProductRouter);
app.use("/api/cart", cartRouter);
// app.use("/api/sessions", sessionRouter);
app.use("/api/sessions", (req, res, next) => {
  res.locals.session = req.session;
  next();
}, sessionRouter);

app.get("/", (req, res) => {
  res.redirect("/api/sessions/login");
});