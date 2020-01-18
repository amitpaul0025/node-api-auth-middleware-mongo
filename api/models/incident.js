const mongoose = require('mongoose');

const incidentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	number: Number
});

module.exports = mongoose.model('Incident',incidentSchema);