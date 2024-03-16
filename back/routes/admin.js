const express = require('express');
const router = express.Router();

const admin = require('./../models/admin');

require("dotenv").config();


const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let {name, email, password} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if ( name == "" || email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty input field!"
        })
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid input!"
        })
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid input!"
        })
    } else if(password.length < 8){
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        })
    } else{
        admin.find({email}).then(result => {
            if(result.length) {
                res.json({
                    status: "FAILED",
                    message: "Admin already exists!"
                })
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newAdmin = new admin({
                        name,
                        email,
                        password: hashedPassword,
                        
                    });

                    newAdmin.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup succesful!",
                            data: result
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving admin!"
                        })
                    })

                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })
            }

        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing admin!"
            })
        })

    }
})

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
        admin.find({email})
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
