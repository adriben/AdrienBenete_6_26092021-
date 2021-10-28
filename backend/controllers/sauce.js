const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) =>{
    console.log(req.body);
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   const sauce = new Sauce({
       ...sauceObject,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       likes: 0,
       dislikes: 0
   });
   sauce.save()
   .then(()=> res.status(201).json({ message: "sauce created"}))
   .catch(err => res.status(400).json({ err }))
}

exports.displayAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(err => res.status(400).json({ message: err}))
}

exports.displayOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch(err => res.status(400).json({ err }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  
    } : {...req.body}
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(sauce => res.status(200).json({ message: 'object has been modified'}))
    .catch(err => res.status(400).json({ err }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message: "object successfully deleted"}))
        .catch(err => res.status(400).json({ err }))
    })})
    .catch(err => res.status(400).json({ err })) 
}

exports.likeSauce = (req, res, next) =>{
    console.log(req.body.userId)
    if(req.body.like == 1){
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            sauce.usersLiked.push(req.body.userId);
            
            
             console.log(sauce);
        }  )
        .then(() => res.status(201).json({ message: "sauce liked"}))
        .catch(err => res.status(400).json({ err }))

    }
    else if(req.body.like == -1){
        console.log('unliked');
    }
}