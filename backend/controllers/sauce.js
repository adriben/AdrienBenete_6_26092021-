const Sauce = require('../models/Sauce');
const fs = require('fs');  

//CREATION OF A SAUCE
exports.createSauce = (req, res, next) =>{
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   const sauce = new Sauce({
       ...sauceObject,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       likes: 0,
       dislikes: 0
   });
   sauce.save()  //saving the sauce in the db
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
    Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
        if(req.body.like == 1){
         sauce.likes += 1;
         sauce.usersLiked.push(req.body.userId);
         sauce.save()
        }
        else if(req.body.like == -1){
        sauce.dislikes += 1;
         sauce.usersDisliked.push(req.body.userId);
         sauce.save()
        }
        else if(req.body.like == 0){
            let likeIndex = sauce.usersLiked.indexOf(req.body.userId);
            let dislikeIndex = sauce.usersDisliked.indexOf(req.body.userId);

            if(likeIndex >-1){
                sauce.likes -= 1;
                sauce.usersLiked.splice(likeIndex, 1)
                
                
            } else if(dislikeIndex > -1){
                sauce.dislikes -= 1;
                sauce.usersDisliked.splice(dislikeIndex, 1)
            }
            sauce.save()
        }
    })
    .then((response) => res.status(201).json({ response }))
    .catch(err => res.status(400).json({ err }))
}