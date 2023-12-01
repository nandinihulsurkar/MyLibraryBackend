import express from "express";
const router = express.Router();

import md5 from "md5";

import db from "./Database.js";

router.get('/', (req, res) => {
    const qry = "SELECT id, full_name, mobile_no, status, DATE_FORMAT(created_on, '%d %M %Y') as registered_on FROM users";
    
    db.query(qry, (err, data)=>{
        if(err) return res.json(err);

        return res.json(data);
    })
});

router.get('/changeUserStatus/:uid/:status', (req, res) => {
    const userId = req.params.uid;
    const changeStatusTo = req.params.status;
    
    const changeStatusqry = "UPDATE users SET status = ? WHERE id = ?";
    db.query(changeStatusqry, [changeStatusTo, userId], (err, data)=>{
        if(err) return res.json("Server Error: Update user status query failed.");

        return res.json('Success');
    })
});

//START of - User Registration
router.post('/registration', (req, res) => {
    const insertQry = "INSERT INTO users (`full_name`, `mobile_no`, `pwd`) VALUES (?)";
    const values = [req.body.full_name, req.body.mobile_no, md5(req.body.pwd)];
    
    db.query(insertQry, [values], (err, data) => {
        if(err) return res.json("Error");
        return res.json("Success");
    });
});
//ENDDD of - User Registration

//START of - User Login
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
        {
            if(theData[0]['status'] == 'Inactive')
                return res.json("Inactive");
            else
                return res.json(theData);            
        }
    })
});
//ENDDD of - User Login

//START of - Change Password Logic
router.post('/checkOldPassword', (req, res) => {
    const oldPwd = md5(req.body.old_pwd);
    const userId = req.body.lin_user_id;
    
    const chkOldPwdQuery = 'SELECT full_name FROM users WHERE id = '+userId+' AND pwd = "'+oldPwd+'" ';    
    db.query(chkOldPwdQuery, (err, data) => {
        if(err) return "Error in the query to check the old password";

        if(data.length == 0)
            return res.json("Incorrect Old Password");
        else
            return res.json("Success");
    })
});

router.post('/changePassword', (req, res) => {
    const newPwd = md5(req.body.new_pwd);
    const userId = req.body.lin_user_id;
    
    const updatePwdQuery = 'UPDATE users SET pwd = "'+newPwd+'" WHERE id = '+userId;
    db.query(updatePwdQuery, (err, data) => {
        if(err) return res.json("Serverside : Change Password query failed.");

        return res.json("Success");
    })
});
//END of - Change Password Logic

//START of - Update Profile Details
router.get('/getUserInfo/:uid', (req, res) => {
    const userId = req.params.uid;
    const gudQuery = 'SELECT id, full_name, mobile_no FROM users WHERE id = '+userId;
    db.query(gudQuery, (err, uData) => {
        if(err) return res.json("Serverside : Fetching user info query failed.");

        return res.json(uData[0]);
    })
});

router.get('/checkMobileNoExistsInUpdateProfile/:mno/:uid', (req, res) => {
    const mobileNo = req.params.mno;   
    const userId = req.params.uid;
    const chkMNexists = "SELECT * FROM users WHERE mobile_no = ?";

    db.query(chkMNexists, [mobileNo], (err, data) => {
       
        if(err) return res.json("Serverside : Mobile number verification query failed.");
        
        else if(userId != data[0]['id'])
            return res.json("Mno Already Exists");        
    })
});

router.post('/updateProfile', (req, res) => {
    const upQuery = "UPDATE users set full_name = '"+req.body.full_name+"', mobile_no = '"+req.body.mobile_no+"' WHERE id = "+req.body.lin_user_id;
    db.query(upQuery, (err, result) => {
        if(err) return res.json("Serverside : Update Profile query failed.");

        return res.json(result);
    })
});
//END of - Update Profile Details

export default router;