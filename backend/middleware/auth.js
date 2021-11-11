const jwt = require('jsonwebtoken');

//MIDDLEWARE of authentification, creation of a token for the session of the user

module.exports = (req, res, next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'ghuf342fkoy78gderlokA6');
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw 'This user Id is not valable'
        }
        else{
            next()
        }
    }catch{
        res.status(401).json({ error: error | "Unidentified request"})
    }
}