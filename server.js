//Install express server
const express = require('express');
const path = require('path');

const app = express();
const env = require("dotenv");
env.config();

const request = require("request");

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/weather-my-route'));

app.get('/forecast', function(req, result) {

  request(`https://api.darksky.net/forecast/${process.env.darkSkyApiKey}/${req.query.details}`, function(e, res, body) {
    
    console.log(e, res, body);

    if (e) {
      result.status(500);
      result.send();
    } else {
      result.status(res.statusCode).send(JSON.parse(body));
    }

  });
})

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/weather-my-route/index.html'));
});

// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Express server listening on port', port)
});