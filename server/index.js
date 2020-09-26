require('dotenv').config()
const express = require('express')
const bp = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const {registerValidator} = require('./validators/Validator')
const jwt = require('jsonwebtoken')

const app = express();
require('./DataBase/mongoDB.js')
const { isLoggedIn, isAdmin } = require('./Auth/Authorization')

app.use(bp.urlencoded({extended: false}))
app.use(bp.json())
app.use(cors())

app.use('/users', isLoggedIn, require('./router/userRouter'))
app.use('/admin', isAdmin, require('./router/adminRouter'))
app.use('/posts', require('./router/postRouter'))
app.use('/comments', require('./router/commentRouter'))


app.post('/register', registerValidator, async (req, res)=>{

    let { name, email, password} = req.body
    const user = await User.findOne({email: email})
    if(user){
        return res.status(400).send('Este e-mail já se encontra em uso')
    }try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name, email, password: hashedPassword
        })
        await newUser.save()
        return res.status(200).send('Conta cadastrada')
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.post('/login', async (req, res) =>{
    let { email, password } = req.body

    const user = await User.findOne({ email: email})
    if(!user){
        return res.status(400).send('Credenciais incorretas')
    }
    await bcrypt.compare(password, user.password, (err, match)=>{
        if(err){
            throw err
        }
        if(!match){
            return res.status(400).send('Credenciais incorretas')
        }else{
            let payload = {
                id: user._id,
                name: user.name,
                email:user.email,
                isAdmin: user.isAdmin
            }
            const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '2 days'})
            if(!token){
                return res.status(500).send('Erro interno')
            }else{
                return res.status(200).send({user: payload, token: `Bearer ${token}`})
            }
        }
    })
})

app.get('/auth/token', async(req, res)=>{
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
                res.status(201).send('OK')
            }
        } catch (error) {
            res.status(403).send(error)
        }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`Running on PORT ${PORT} // http://localhost:${PORT}`);
})