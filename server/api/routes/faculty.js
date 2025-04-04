const express = require('express');

const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        msg:'This is a faculty get req'
    })
})
router.post('/',(req,res,next)=>{
    res.status(200).json({
        msg:'This is a faculty post req'
    })
})

module.exports =router;