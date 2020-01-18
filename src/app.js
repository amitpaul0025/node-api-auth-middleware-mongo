const express = require('express');

const app = express();

const mongoose = require('mongoose');

//package to get log
const morgan = require('morgan');

//package to parse your body
const bodyParser = require('body-parser');

const incidentRoutes = require('../api/routes/incidents');
const incidentRoutesSN = require('../api/routes/servicenow/incidents');
const userRoutes = require('../api/routes/user');
const soapApiTest = require('../api/soap/testing');
const soapApiResponse = require('../api/routes/soapService');
const checkAuth = require('../api/middleware/check-auth');

/*mongoose.connect(
	'mongodb+srv://api-test:'+process.env.MONGO_ATLAS_PWD+'@cluster0-nnrti.mongodb.net/test?retryWrites=true',
	{
		useMongoClient: true
	}
)*/

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/middleware1';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//log in console
app.use(morgan('dev'));

//use body parser to encode request
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//routes to access Api's
app.use('/incidents', incidentRoutes);
app.use('/incidentsSN', incidentRoutesSN);
app.use('/user', userRoutes);
app.use('/soapTest', soapApiTest);
app.use('/soapService',soapApiResponse);


//error handling
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error:{
			message: error.message
		}
	})
});

module.exports = app;