var User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can't be empty" });
        return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).send({ message: "Email must be in the format example@mail.com" });
        return;
    }

    
    if (!req.body.username || req.body.username.trim() === "") {
        res.status(400).send({ message: "Username can't be empty" });
        return;
    }

    
    if (req.body.password.length < 8) {
        res.status(400).send({ message: "Password must be at least 8 characters long" });
        return;
    }

    
    User.findOne({ email: req.body.email })
        .then(existingEmail => {
            if (existingEmail) {
                res.status(400).send({ message: "User with this email already exists" });
                return;
            }

            
            User.findOne({ username: req.body.username })
                .then(existingUsername => {
                    if (existingUsername) {
                        res.status(400).send({ message: "User with this username already exists" });
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
                                res.send(data);
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
                        message: err.message || "Some error occurred while checking for existing username"
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while checking for existing email"
            });
        });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "Email is incorrect!" });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(401).send({ message: "Password is incorrect!" });
                }

                const token = jwt.sign({ id: user.id, username: user.username,  role: user.role }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                
                res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 3600000 }).status(200).json({ token, id: user.id, username: user.username,  role: user.role });
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
    const searchQuery = req.query.search; 

    if (searchQuery) {
        User.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } }, 
                { email: { $regex: searchQuery, $options: 'i' } } 
            ]
        })
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving users with search query" });
        });
    } else {
        User.find()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving users" });
        });
    }
};
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: `User with id ${id} not found` });
            }

            const { username, email } = user;
            res.send({ username, email });
        })
        .catch(err => {
            res.status(500).send({ message: `Error retrieving user with id ${id}` });
        });
};

exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data can't be empty" });
    }

    const id = req.params.id;

    try {
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).send({ message: `User with id ${id} not found` });
        }

        if (req.body.username && req.body.username !== user.username) {
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
                return res.status(400).send({ message: "Username already exists!" });
            }
        }

        if (req.body.currentPassword && req.body.newPassword) {
            const isPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).send({ message: "Current password is incorrect!" });
            }

            if (req.body.newPassword.length < 8) {
                return res.status(400).send({ message: "New password must be at least 8 characters long!" });
            }

            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
            await User.findByIdAndUpdate(id, { password: hashedPassword }, { useFindAndModify: false });
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true });

        res.status(200).send({ message: "User information updated successfully!", user: updatedUser });
    } catch (error) {
        console.error("Error updating user", error);
        res.status(500).send({ message: "Error updating user" });
    }
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
