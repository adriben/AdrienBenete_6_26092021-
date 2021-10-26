const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) =>{
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   const sauce = new Sauce({
       ...sauceObject,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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


