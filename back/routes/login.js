const express = require('express');
const router = express.Router();

const user = require('./../models/user');

require("dotenv").config();
const bcrypt = require('bcrypt');


router.post('/signin', (req, res) => {
    let { email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password == "" ) {
        res.json({
            status: "FAILED",
            message: "Empty field!"
        })

    } else{
        user.find({email})
        .then((data) => {
            if(data.length){
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        res.json({
                            status: "SUCCESS",
                            message: "Signin succesful!",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing passwords!"
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credientals entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user!"
            })
        })
    }

})

module.exports = router;
