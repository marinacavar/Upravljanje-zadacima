const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can't be empty" });
        return;
    }

    // Validating name format (first name and last name)
    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!nameRegex.test(req.body.name)) {
        res.status(400).send({ message: "Name must contain first and last name separated by a space" });
        return;
    }

    // Validating email format
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).send({ message: "Email must be in the format example@gmail.com" });
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
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        // Save the user to the database
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
};

exports.find = (req, res) => {
    // Implementation for finding user
};

exports.update = (req, res) => {
    // Implementation for updating user
};

exports.delete = (req, res) => {
    // Implementation for deleting user
};
