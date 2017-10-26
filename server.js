
const express = require('express')
const app = express()
var fetch = require('node-fetch')
// import Headers from 'node-fetch'

var numreqs = 0;
var api_code = "";
var api_state = false;
var client_id = "9b66dbb382374c74aa8d7a6d3d20f475";
var access_token = false;
var refresh_token = false;

// look in .env for secret key

// Port 3001 by default or else whatever Heroku tells it to be 
const port = process.env.PORT || 3001;

// Client ID: 9b66dbb382374c74aa8d7a6d3d20f475
// https://esi.tech.ccp.is/latest/?datasource=tranquility

// https://login.eveonline.com/oauth/authorize/?response_type=code&redirect_uri=https%3A%2F%2F3rdpartysite.com%2Fcallback&client_id=3rdpartyClientId&scope=characterContactsRead%20characterContactsWrite&state=uniquestate123

// Here is the magic sauce that came through the internet: 
// http://localhost:3000/callback?code=3MW4Td19jfYXB02g-zjrB1P9z4DHkZJjeiwZaV7wzpZufG3HxPW5_VCbQQg0XpDk0&state=eqmviistate1


const secret_key = process.env.EVESECRETKEY || "Sorry, reading the environment variable didn't work";
console.log(process.env.EVESECRETKEY);


app.use(function (req, res, next) {
    numreqs += 1;
    //res.send('uh this is the webpage');
    //res.redirect("http://localhost:3000/");
    //console.log("The requesting begins! Req #: " + numreqs);
    //console.log(req.originalUrl);
    if (api_code && api_state){
        console.log("We have the code and state, let's get our token!");
        // proceed with the OAuth 2 process

        var authorization_encode = client_id + ":" + secret_key;
        console.log("Magic thing: " + authorization_encode);
        authorization_encode = new Buffer(authorization_encode).toString('base64');
        // below code checks base 64 encoding from the eve docs
        // console.log(new Buffer("3rdparty_clientid:jkfopwkmif90e0womkepowe9irkjo3p9mkfwe").toString('base64'));
        console.log("Base 64'd: " + authorization_encode);
        authorization_encode = "Basic " + authorization_encode;

        // this part is less good 
        var myHeaders = new fetch.Headers({
            Authorization: authorization_encode,
            "Content-Type": "application/json",
            Host: "login.eveonline.com"
          });

          console.log(myHeaders);

          // this looks good 
          var myBody = {
            "grant_type":"authorization_code",
            "code": api_code
          };


        fetch('https://login.eveonline.com/oauth/token', { method: "POST", body: JSON.stringify(myBody), headers: myHeaders})
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                else { throw Error (res.statusText)}
            })
            .then(res => {
                console.log("API server response received!");
                console.log(res);
                access_token = res.access_token;
                refresh_token = res.refresh_token;
                console.log("Access token: " + access_token);
                console.log("Refresh token: " + access_token);

            })
            .catch(error => {console.log(error)})

        api_code = false;
        apid_state = false;
    }
    next()
})

// TODO: Figure out why this borks everything in the flow
  // express looks up files relative to the static directory,
// so it doesn't become part of the url



  // API endpoint for testing
app.get('/callback', function (req, res) {
    console.log("Callback endpoint hit");
    api_code = req.query.code;
    api_state = req.query.state;
    console.log("Code: " + api_code);
    console.log("State: " + api_state);
    // TODO: The codes and the state land, use them to be able to make API requests! 
    /* 
    code: The Authorization code.
    state: The state parameter that was sent in the original request to the SSO.
    */
    res.redirect("http://localhost:3001/");
    //res.json("FOFOFOFOFOFO");
  })

  // API endpoint for testing
app.get('/test', function (req, res) {
    console.log("The test endpoint hit");
    res.json("The top secret key:" + secret_key);
  })    
  

 app.use(express.static('build'))


// Start up the server:
app.listen(port, function () {
    console.log('App up and listening on port ' + port + '!')
})