const router = require('express').Router()
const { postValidator } = require('../validators/Validator')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const { isAdmin } = require('../Auth/Authorization')


router.get('/:page', async (req, res)=>{
    var perPage = 5
            , page = Math.max(0, req.params.page)
    try {
        const tam = (await Post.find()).length
        const posts = await Post.find().limit(perPage).skip(perPage * (page - 1)).sort({_id: 'desc'})
        return res.status(200).send({posts, tam})
    } catch (error) {
        return res.status(500).send('Não foi possível carregar as postagens')
    }
})


router.get('/post/:slug', async (req, res)=>{
    try {
        const post = await Post.findOne({slug: req.params.slug})
        if(!post){
            return res.status(404).send('Postagem não encontrada');
        }
        return res.status(200).send(post)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Erro interno')
    }
})
router.post('/create', isAdmin, postValidator, async(req, res)=>{
    let{title, description, slug, content, img, imgOwner} = req.body

    try {
        let post =  new Post({
            title, description, slug, content, img, imgOwner
        })
        await post.save()
        return res.status(201).send('Postagem criada')
    } catch (error) {
        return res.status(500).send('Erro interno')
    }
})

router.get('/edit/:slug', isAdmin, async (req, res)=>{
    try {
        const post = await Post.findOne({ slug: req.params.slug })
        if(!post) {
            return res.status(400).send('Postagem não encontrada');
        }
        return res.status(200).send(post)
    } catch (error) {
        return res.status(500).send('Erro interno');
    }
})
router.post('/edit/:slug', isAdmin, async (req, res) => {
    let{title, description, slug, content, img, imgOwner} = req.body
    if(!title || !description || !slug || !content || !img || !imgOwner){
        return res.status(400).send('Preencha todos os campos');
    }
    var post = await Post.findOne({slug: slug});
    if(post > 1){
        return res.status(404).send('Essa slug já existe')
    }
    try {
        post = await Post.findOneAndUpdate({slug: req.params.slug},{new: true})
        post.title = title
        post.description = description
        post.slug = slug
        post.content = content,
        post.img = img,
        post.imgOwner = imgOwner
        await post.save()
        return res.status(200).send('Postagem atualizada')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Erro interno')
    }
})

router.post('/delete/:slug', isAdmin, async(req, res)=>{
    try {
        const post = await Post.findOneAndDelete({slug: req.params.slug});
        await Comment.deleteMany({post_id: post._id})
        return res.status(200).send('Postagem deletada');
    } catch (error) {
        console.log(error)
        return res.status(500).send('Erro interno, não foi possível deletar a postagem.')
    }
})

module.exports = router