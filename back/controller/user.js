var User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can't be empty" });
        return;
    }

    
    const emailRegex = /^[^\s@]/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).send({ message: "Email must be in the format example@mail.com" });
        return;
    }

   
    User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                res.status(400).send({ message: "User with this email already exists" });
                
                return;
            }

           
            if (req.body.password.length < 8) {
                res.status(400).send({ message: "Password must be at least 8 characters long" });
                return;
            }

            
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || "Error hashing password"
                    });
                    return;
                }

                const user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword
                });

                
                user.save()
                    .then(data => {
                        
                        const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
                            expiresIn: '1h' 
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

    
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            
            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(401).send({ message: "Invalid email or password" });
                }

                
                const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, {
                    expiresIn: '1h' 
                });

                
                res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }).status(200).json({ token, role: user.role });
            });
        })
        .catch(err => {
            res.status(500).send({ message: "Error occurred while logging in" });
        });
};

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(403).send({ message: "Invalid token" });
        }
        req.userId = decodedToken.userId;
        next();
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



