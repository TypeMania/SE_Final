const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/index(.html)?(/)?$|^/$', (req,res)=>{res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));});
router.all('*', (req,res)=>{res.sendFile(path.join(__dirname, '..', 'views', '404.html'))});

module.exports = router;