

import cors from "cors";
import express from "express";
//const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:1234/']
}));

//import db from "./Database.js";

import mysql, { createConnection } from "mysql";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_library"
});

export default db;