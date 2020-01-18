const soap = require('soap');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const convert = require('xml-js');
module.exports = (req, res, next) =>{

var myService = {
      GlobalWeather: {
        GlobalWeatherSoap: {
          GetWeather: function(args, callback) {
                  // do some work
                  callback({
                      name1: args.CountryName,
                      name5: args.CityName
                  });
              },
          GetCitiesByCountry: function(args, callback) {
                  // do some work
                  callback({
                      name2: args.CountryName
                  });
              }
        },
        GlobalWeatherSoap12: {
          GetWeather: function(args, callback) {
                  // do some work
                  callback({
                      name3: args.CountryName,
                      name6: args.CityName
                  });
              },
          GetCitiesByCountry: function(args, callback) {
                  // do some work
                  callback({
                      name4: args.CountryName
                  });
              }
        }
      }
    };

var app = express();

var xml = require('fs').readFileSync('weather.wsdl','utf8');
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
  app.listen(8001, function(){
      //Note: /wsdl route will be handled by soap module
      //and all other routes & middleware will continue to work
      soap.listen(app, '/wsdl', myService, xml, function(){
        console.log('server initialized');
      });
  });

}