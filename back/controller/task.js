const Task = require('../models/task');
const moment = require('moment');
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can't be empty" });
        return;
    }
    const deadline = moment(req.body.deadline, 'DD-MM-YYYY').toDate();
    const task = new Task({
        tasks: req.body.tasks,
        user: req.body.user,
        deadline: deadline,
        status: req.body.status
    });
    task.save()
        .then(data => {
            res.status(201).json(data); // Send back the created task as a response
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred creating task"
            });
        });
}


exports.find = (req, res) => {
    if(req.query.id){
        const id=req.query.id;
    
        Task.findById(id)
        .then(data => {
            if(!data){
                res.status(404).send({message:"Not found task with id"+id})
            }else{
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({message:"Error retriving task with id"+id})
        })

    }else{
        Task.find()
        .then(task => {
           res.send(task)
        })
        .catch(err =>{
            res.status(500).send({message: err.message || "Error occure while retriving task information"})
       })

    }
};

exports.update = (req, res) => {
    if(!req.body){
        return res.status(400).send({message:"Data can't be empty"})
    }

    const id=req.params.id;
    Task.findByIdAndUpdate(id,req.body,{useFindAndModify:false, new: true})
    .then(data=>{
        if(!data){
            res.status(404).send({message:`Can't update task with ${id}`})
        }else{
            res.send(data)
        }
    })
    .catch(err =>{
        res.status(500).send({message: "Error Update user "})
    })
};

exports.delete = (req, res)=>{
    const id=req.params.id;

    Task.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Task was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: `Cannot delete task with id ${id}.`
            });
        });
}

