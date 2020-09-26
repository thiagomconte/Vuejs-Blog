const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify: false
}).then(() =>{
    console.log('Database connected')
}).catch( err =>{
    console.log(err)
    process.exit(1)
})