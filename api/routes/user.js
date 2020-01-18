const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/',(req, res, next) => {
	User.find()
		.exec()
		.then(doc => {
			console.log('All user list from DB = '+doc);
			if(doc)
				res.status(200).json(doc);
			else
				res.status(404).json({message: 'No record found'});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({error: err});
		})
});

router.post('/signup',(req, res, next) => {
	User.find({email: req.body.email})
		.exec()
		.then(user => {
			if(user.length >=1){
				return res.status(409).json({
					message: "User Exists"
				})
			}else{

				bcrypt.hash(req.body.password, 10, (err, hash) => {
				if(err){
					return res.status(500).json({
						error: err
					})
				}else{
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash

					});
					user.save()
						.then(result => {
							console.log(result);
							res.status(200).json({
								message: "User created",
								userDetails: user
							});
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							})
						});
						
					}
				});

			}
		});	
});

router.post("/login",(req, res, next) =>{
	User.find({email: req.body.email})
		.exec()
		.then(user => {
			if(user.length==0){
				return res.status(401).json({
					message: "Auth failed"
				})
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
				if(err){
					return res.status(401).json({
						message: "Auth failed"
					})
				}
				if(result){
					const token = jwt.sign(
						{
							email: user[0].email,
							userId: user[0]._id
						},
						process.env.JWT_KEY,
						{
							expiresIn: "1h"
						}

					);
					return res.status(200).json({
						message: "Auth Successful",
						token: token
					})
				}
				return res.status(401).json({
						message: "Auth failed"
					})
			})

		})
		.catch(err =>{
			res.status(500).json({
				error: err
			})
		});	
});


router.get('/:userId', (req, res, next) => {
	const id = req.params.userId;
	User.findById(id)
		.exec()
		.then(doc => {
			console.log("From DB = "+doc);
			if(doc){
				res.status(200).json(doc)
			}else{
				res.status(404).json({
					message: "Data not found"
				})
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({error:  err});
		})
});

router.patch('/:userId', (req, res, next) => {
	const id = req.params.userId;
	const udpateParams = {};
	for( const param of req.body){
		udpateParams[param.name] = param.value;
	}
	User.update({ _id: id}, { $set: udpateParams })
		.exec()
		.then(doc => {
			console.log("Update Record  = "+doc);
			if(doc){
				res.status(200).json(doc)
			}else{
				res.status(404).json({
					message: "Data not found"
				})
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({error:  err});
		})
});


router.delete('/:userId', (req, res, next) => {
	const id = req.params.userId;
	User.remove({ _id: id})
		.exec()
		.then(doc => {
			console.log("Record Deleted = "+doc);
			if(doc){
				res.status(200).json(doc)
			}else{
				res.status(404).json({
					message: "Data not found"
				})
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({error:  err});
		})
});

module.exports = router;