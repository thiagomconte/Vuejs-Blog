const Post = require('../models/Post')

module.exports = {
    registerValidator: function(req, res, next){
        var regex = new RegExp('\\s')
        let { name, email, password, checkpassword} = req.body
        if(!name || !email || !password || !checkpassword){
            return res.status(400).send('Preencha todos os campos')
        }
        if( password.length < 6 || checkpassword.length < 6){
            return res.status(400).send('Senha deve conter pelo menos 6 caracteres')
        }
        if( password !== checkpassword){
            return res.status(400).send('Senhas estão diferentes')
        }
        if( regex.test(password)){
            return res.status(400).send('A senha não pode conter espaços em branco')
        }
        next()
    },
    postValidator: async function(req, res, next) {
        let{title, description, slug, content, img, imgOwner} = req.body
        if(!title || !description || !slug || !content || !img || !imgOwner){
            return res.status(400).send('Preencha todos os campos');
        }
        try {
            const post = await Post.findOne({ slug: slug})
            if(post){
                return res.status(400).send('Essa slug já existe')
            }else{
                next()
            }
        } catch (error) {
            return res.status(500).send('Erro interno, tente novamente mais tarde')
        }
    }
}