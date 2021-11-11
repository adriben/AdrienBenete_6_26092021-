const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//create a new user in the DB
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)      //hash and salt the password before saving in the DB
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(()=> res.status(201).json({ message: "user successfully created"}))
        .catch(err => res.status(400).json({ err }))
    })
   .catch(err => res.status(500).json({ err }))
}

//login with an existing user's email
exports.login = (req, res, next) =>{  
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user){return res.status(401).json({ error: 'user not found'})}
        bcrypt.compare(req.body.password, user.password) //compare the password of the user with the one in the DB
        .then(valid =>{
            if(!valid){return res.status(401).json({ error: 'invalid password'})}
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id},
                    'ghuf342fkoy78gderlokA6',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(err => res.status(500).json({ err}))
     })
     .catch(err => res.status(500).json({ err}))
 };

