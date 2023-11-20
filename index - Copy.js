
import express from "express";
import cors from "cors";
import mysql, { createConnection } from "mysql";

const app = express();

const db = createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_library"
})

app.use(express.json());  // allows us to send a json file from client / post method

//app.use(cors());
app.use(cors({
    origin: ['http://localhost:1234/']
}));

app.get('/', (req, res) => {
    res.json("Hi.. This is the backend for My Library");
})

app.get('/users', (req, res) => {
    const qry = "SELECT * FROM users";
    db.query(qry, (err, data)=>{
        if(err) return res.json(err);

        return res.json(data);
    })
});

app.post('/users/registration', (req, res) => {
    return res.json("The user has been created successfully");
    /*const insertQry = "INSERT INTO users (`full_name`, `mobile_no`, `pwd`) VALUES (?)";
    const values = [req.body.full_name, req.body.mobile_no, req.body.pwd];

    db.query(insertQry, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json("The user has been created successfully");
    });*/
});

app.get('/users/checkMobileNoExists/:mno', (req, res) => {
    const mobileNo = req.params.mno;    
    const chkMNexists = "SELECT * FROM users WHERE mobile_no = ?";

    db.query(chkMNexists, [mobileNo], (err, data) => {
        if(err) return res.json(err);

        return res.json(data.length);
    })
});

app.listen(8800, () => {
    console.log("Connected to backend ");
})