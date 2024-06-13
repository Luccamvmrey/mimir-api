import express from 'express';
import bodyParser from "body-parser";
import {getClasses} from "./routes/classesRoutes.js";

const app = express();
app.use(bodyParser.json());

// Endpoint to classes-routes base on query parameters
app.get("/mimirV1/classes", getClasses);

module.exports = app;
