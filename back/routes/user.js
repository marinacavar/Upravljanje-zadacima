const express = require('express');
const router = express.Router();

const user = require('./../models/user');


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
        user.find({email}).then(result => {
            if(result.length) {
                res.json({
                    status: "FAILED",
                    message: "User already exists!"
                })
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new user({
                        name,
                        email,
                        password: hashedPassword,
                        verified: false
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "Succes",
                            message: "User created!"
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user!"
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
                message: "An error occured while checking for existing user!"
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