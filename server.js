const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;

const axios = require('axios');
const https = require('https');
const openweatherHelper = require('openweathermap-node');

const request = require("request");

app.use(cors());
app.use(bodyParser.json());

const defaultApiKey = 'c20f298588437c47ed907acbd44119da';
const defaultTown = 'Omsk';
const defaultUnits = 'metric'; // imperial

app.get('/getWeather', function(req, res) {
  const helper = new openweatherHelper(
    {
        APPID: defaultApiKey,
        units: req.query.units || defaultUnits
    }
  );
  helper.getCurrentWeatherByCityName((req.query.town || defaultTown), (err, currentWeather) => {
    if(err){
        console.log(err);
    }
    else{
      console.log(currentWeather);
      res.send(JSON.parse(JSON.stringify(currentWeather)))
    }
  });
})

app.get('/getWeatherRu', function(req, res) {
  let cityName = req.query.city || defaultTown;
  let units = req.query.units || defaultUnits;

  function sendResponse(err, data, callback){
  	let error = null;
  	let response = null;

  	error = err;
  	if(data){
  		if(data.statusCode != 200){
  			let e = JSON.parse(data.body)
  			error = new Error(e.message);
  			error.status = e.cod;
  		}
  		if(data.body){
  			response = JSON.parse(data.body);
  		}
  	}
  	callback(error, response);
  }

  request.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=ru&units=${units}&APPID=${defaultApiKey}`,
	 (err, data)=>{
     function callback() {
       console.log(data.body);
       res.send(err || data.body);
     }
		sendResponse(err, data, callback);
	})
})

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
