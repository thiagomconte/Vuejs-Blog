const router = require('express').Router()
const Comment = require('../models/Comment')
const {isAdmin} = require('../Auth/Authorization')

router.post('/create', isAdmin, async (req, res)=>{
    let { user_id, post_id, content } = req.body
    if(!user_id || !post_id){
        return res.status(400).send('Não foi possível completar a ação')
    }
    if(!content){
        return res.status(400).send('O comentário não pode ficar em branco')
    }
    try {
        const comment = new Comment({
            user_id, post_id, content
        })
        await comment.save();
        return res.status(200).send('Comentário adicionado')
    } catch (error) {
        return res.status(500).send('Erro interno')
    }
})

router.get('/:id/:limit', async (req, res) => {
    let limit = parseInt(req.params.limit)
    try {
        const num = (await Comment.find({post_id: req.params.id})).length
        const commentsFound = await Comment.find({post_id:req.params.id}).limit(limit).populate({path:'user_id', select:'-password -_id -email'}).sort({_id: 'desc'})
        return res.status(200).send({commentsFound, num: num})
    } catch (error) {
        console.log(error)
        return res.status(500).send('Erro interno')
    }
})
router.post('/delete/', isAdmin, async (req, res)=>{ 
    try {
        await Comment.deleteOne({_id: req.body.id})
        return res.status(200).send('Comentario removido')
    } catch (error) {
        return res.status(500).send('Erro interno')
    }
})

module.exports = router