const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Incident = require('../models/incident');
const checkAuth = require('../middleware/check-auth');

router.get('/',(req, res, next) => {
	Incident.find()
		.exec()
		.then(doc => {
			console.log('All incident list from DB = '+doc);
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

router.post('/', checkAuth, (req, res, next) => {
	const incident = new Incident({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		number: req.body.number

	});
	incident
		.save()
		.then(result => {
			console.log(result);
		})
		.catch(err => console.log(err));
	res.status(200).json({
		message: "Incident created",
		incidentDetails: incident
	});
});


router.get('/:incidentId', (req, res, next) => {
	const id = req.params.incidentId;
	Incident.findById(id)
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

router.patch('/:incidentId', (req, res, next) => {
	const id = req.params.incidentId;
	const udpateParams = {};
	for( const param of req.body){
		udpateParams[param.name] = param.value;
	}
	Incident.update({ _id: id}, { $set: udpateParams })
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


router.delete('/:incidentId', (req, res, next) => {
	const id = req.params.incidentId;
	Incident.remove({ _id: id})
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