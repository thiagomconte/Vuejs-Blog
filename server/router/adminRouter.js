const router = require('express').Router()
const {isAdmin} = require('../Auth/Authorization')
const User = require('../models/User')

router.get('/', (req, res)=>{
    res.send('ok')
})

router.get('/users',isAdmin, async (req, res)=>{
    try {
        const users = await User.find().select('-password');
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send('Erro interno')
    }
})

router.post('/options/changerole', isAdmin, async(req, res)=>{
    const {id, isAdmin} = req.body;
    try {
        const userFound = await User.findByIdAndUpdate(id);
        if(!userFound){
            res.status(400).send('Usuário não encontrado')
        }else{
            userFound.isAdmin = isAdmin;
            await userFound.save();
            res.status(200).send('Usuário atualizado')
        }
    } catch (error) {
            res.status(500).send("Erro interno, tente novamente mais tarde")
    }
})

router.post('/deleteuser', isAdmin, async(req, res)=>{
    const {id} = req.body
    try {
        await User.deleteOne({_id: id})
        return res.status(200).send('Usuário deletado');
    } catch (error) {
        return res.status(500).send('Erro interno, tente novamente mais tarde')
    }
})

module.exports = router