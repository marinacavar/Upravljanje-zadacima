var User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can't be empty" });
        return;
    }

    // Validating email format
    const emailRegex = /^[^\s@]/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).send({ message: "Email must be in the format example@mail.com" });
        return;
    }

    // Check if user with the provided email already exists
    User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                res.status(400).send({ message: "User with this email already exists" });
                
                return;
            }

            // Validating password length
            if (req.body.password.length < 8) {
                res.status(400).send({ message: "Password must be at least 8 characters long" });
                return;
            }

            // Hash the password
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || "Error hashing password"
                    });
                    return;
                }

                // Create a new user instance with hashed password
                const user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword
                });

                // Save the user to the database
                user.save()
                    .then(data => {
                        // Generate JWT token for the registered user
                        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
                            expiresIn: '1h' // Token expires in 1 hour
                        });

                        res.status(201).send({ message: "User registered successfully", token });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred creating user"
                        });
                    });
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while checking for existing user"
            });
        });
};



exports.login = (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            // Check password
            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(401).send({ message: "Invalid email or password" });
                }

                // Create JWT token
                const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
                    expiresIn: '1h' // Token expires in 1 hour
                });
                //res.status(201).send({ message: "Logged in", email,  token });
                res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }).status(200).json({token});


               
            });
        })
        .catch(err => {
            res.status(500).send({ message: "Error occurred while logging in" });
        });
};



exports.find = (req, res) => {
    if(req.query.id){
        const id=req.query.id;
    
        User.findById(id)
        .then(data => {
            if(!data){
                res.status(404).send({message:"Not found user with id"+id})
            }else{
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({message:"Error retriving user with id"+id})
        })

    }else{
        User.find()
        .then(user => {
           res.send(user)
        })
        .catch(err =>{
            res.status(500).send({message: err.message || "Error occure while retriving user information"})
       })

    }
};

exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({message:"Data can't be empty"})
    }

    const id=req.params.id;
    User.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
    .then(data=>{
        if(!data){
            res.status(404).send({message:`Can't update user with ${id}`})
        }else{
            res.send(data)
        }
    })
    .catch(err =>{
        res.status(500).send({message: "Error Update user "})
    })
};


exports.delete = (req, res)=>{
    const id=req.params.id;

    User.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: `Cannot Delete user with id ${id}.`
            });
        });
}



