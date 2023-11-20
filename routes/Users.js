import express from "express";
const router = express.Router();

import md5 from "md5";

import db from "./Database.js";

router.get('/', (req, res) => {
    const qry = "SELECT * FROM users";
    
    db.query(qry, (err, data)=>{
        if(err) return res.json(err);

        return res.json(data);
    })
});

router.post('/registration', (req, res) => {
    const insertQry = "INSERT INTO users (`full_name`, `mobile_no`, `pwd`) VALUES (?)";
    const values = [req.body.full_name, req.body.mobile_no, md5(req.body.pwd)];
    
    db.query(insertQry, [values], (err, data) => {
        if(err) return res.json("Error");
        return res.json("Success");
    });
});

router.get('/checkMobileNoExists/:mno', (req, res) => {
    const mobileNo = req.params.mno;    
    const chkMNexists = "SELECT * FROM users WHERE mobile_no = ?";

    db.query(chkMNexists, [mobileNo], (err, data) => {
        if(err) return res.json("Serverside : Mobile number verification query failed.");

        return res.json(data.length);
    })
});

router.post('/checkIsValidPassword', (req, res) => {
    const mno = req.body.mobile_no;
    const pwd = md5(req.body.pwd);

    const validPwdSql = "SELECT full_name from users WHERE mobile_no = '"+mno+"' AND pwd = '"+pwd+"' ";
    db.query(validPwdSql, (err1, pwdData) => {
        if(err1) return res.json("Serverside : Password verification query failed.");

        if(pwdData.length  == 0)
            return res.json("Incorrect Password");
        else
            return res.json("Success");
    })
});

router.post('/login', (req, res) => {
    const mno = req.body.mobile_no;
    const pwd = md5(req.body.pwd);
    
    const dataHereSql = "SELECT * from users WHERE mobile_no = '"+mno+"' AND pwd = '"+pwd+"' ";
    db.query(dataHereSql, (err1,theData) => {
        if(err1) return res.json(err1);

        if(theData.length  == 0)
            return res.json("Error");
        else
            return res.json(theData);
    })

    //return res.json(mno+' '+pwd);
});

export default router;