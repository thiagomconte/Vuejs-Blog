const jwt = require('jsonwebtoken')
const User = require('../models/User')


module.exports = {
    isLoggedIn: async function(req, res, next) {
        try {
            if(!req.headers['authorization']){
                return res.status(403).send('Token inválido')
            }
            const token = req.headers['authorization'].split(" ")
            var decoded = await jwt.verify(token[1], process.env.SECRET_KEY)
            const user = await User.findOne({email: decoded.email}, '-password')
            if(!user){
                return res.status(403).send('Token inválido')
            }else{
                next()
            }
        } catch (error) {
            res.status(403).send(error)
        }
    },
    isAdmin: async function(req, res, next){
        try {
            if(!req.headers['authorization']){
                return res.status(403).send('Token inválido')
            }
            const token = req.headers['authorization'].split(" ")
            var decoded = await jwt.verify(token[1], process.env.SECRET_KEY)
            const user = await User.findOne({email: decoded.email})
            if(!user){
                return res.status(403).send('Token inválido')
            }else if(!decoded.isAdmin){
                return res.status(403).send('Acesso negado')
            }
            next()
        } catch (error) {
            res.status(403).send(error)
        }
    }
}