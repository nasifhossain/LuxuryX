const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

router.get('/',checkAuth, (req, res, next) => {
    Student.find().then(result => {
        //console.log(result);
        res.status(200).json({
            StudentData: result
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: 'In get student',
        })

    })
});

router.post('/', (req, res, next) => {
    console.log(req.body);

    const stud = new Student({
        _id: new mongoose.Types.ObjectId(), // Corrected ID assignment
        name: req.body.name,
        gender: req.body.gender,
        email: req.body.email,
    });

    stud.save()
        .then(result => {
            console.log(result);
            res.status(201).json({  // Use 201 for resource creation
                message: 'Student created successfully!',
                newStudent: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

router.get('/:id', (req, res, next) => {
    console.log(req.params.email);
    Student.findById(req.params.id).then(result => {
        res.status(500).json({
            student: result,
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:'error in get student by id'
        })
        
    })
}

)

router.delete('/:id',(req,res,next)=>{
    Student.deleteOne({_id:req.params.id}).then(result=>{
        res.status(200).json({
            message:'Product Deleted',
            result:result,
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:'Error in delete by id in student',
        })
        
    })
})

router.put('/:id',(req,res,next)=>{
    Student.findOneAndUpdate({_id:req.params.id},{
        $set:{
            name: req.body.name,
            gender: req.body.gender,
            email: req.body.email,
        }
    }).then(result=>{
        res.status(200).json({
            updated:'Student Updated',
            OldProduct:result,
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:'error in put method of student by id'
        })
        
    })
})


module.exports = router;
