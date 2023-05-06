const express = require('express');
const router = express.Router();
const path = require('path');
const err = (req,res)=>{res.json({"error":"404 Not Found"})};

router.get('/index(.html)?(/)?$|^/$', (req,res)=>{res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));});
router.get('^(?!/states)*$|*', (req,res)=>{res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'))});
router.route('^(?!/states)*$|*') // See 5c(ii) of project requirements.
  .post(err)
  .patch(err)
  .delete(err);

module.exports = router;