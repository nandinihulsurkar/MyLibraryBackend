
import express from "express";
import cors from "cors";

import usersRoutes from "./routes/Users.js";
import booksRoutes from "./routes/Books.js";

const PORT = 8800;
const app = express();

app.use(express.json());  // allows us to send a json file from client / post method
app.use(cors());

app.get('/', (req, res) => {
    res.json("Hi.. This is the backend for My Library");
});

app.use('/users', usersRoutes);
app.use('/books', booksRoutes)

app.listen(PORT, () => {
    console.log("Connected to backend ");
})