const router = require('express').Router()
const User = require('../models/User')

router.post('/auth/token', (req, res) => {
    res.status(201).send('ok')
});



module.exports = router