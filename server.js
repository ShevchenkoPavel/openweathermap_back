const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;

const axios = require('axios');
const https = require('https');
const openweatherHelper = require('openweathermap-node');

app.use(cors());
app.use(bodyParser.json());

app.get('/route', function(req, res) {
  console.log('test route')
  res.send('testRoute')
})

app.get('/getWeather', function(req, res) {
  const defaultApiKey = 'c20f298588437c47ed907acbd44119da';
  const defaultTown = 'Omsk';
  const defaultUnits = 'metric'; // imperial
  // let example = 'api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=c20f298588437c47ed907acbd44119da';
  let example = 'https://api.openweathermap.org/data/2.5/weather?q=Omsk,ru&APPID=c20f298588437c47ed907acbd44119da';
  // axios.get(example)
  //   .then(result => res.send(result))
  //   .catch(err => res.send(err))

  // https.get(example, (resp) => {
  //   let data = '';
  //   // A chunk of data has been recieved.
  //   console.log('resp1', resp);
  //   resp.on('data', (chunk) => {
  //     data += chunk;
  //     // console.log('resp2', resp);
  //   });
  //   // The whole response has been received. Print out the result.
  //   resp.on('end', () => {
  //     console.log(JSON.parse(data).explanation);
  //   });
  //   }).on("error", (err) => {
  //     console.log("Error: " + err.message);
  //   });

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

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
