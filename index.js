const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const tokenDecode = require('./middleware/request-access-token-decode');
const deviceOrgAuth = require('./middlware/request-device-org-auth');

const AWS = require('aws-sdk');
AWS.config.update(config.aws);

const mongoose = require('mongoose');
mongoose.connect(config.mongodb.uri);

const redis = require('redis').createClient(config.redis.uri);

const deviceTokens = require('./routes/device-tokens');
const pushem = require('./routes/pushem');

const app = express();

app.set('aws', AWS);
app.set('redis', redis);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(tokenDecode);
app.use(deviceOrgAuth);


/* Potential CLI routes: 
	- Creating a new app
	- Creating a new topic (basically a new organization)
*/

app.post('/device/new', deviceTokens.addToken);
app.post('/notification/push', pushem.sendNotification);

app.listen(config.main.port, () => {
	console.log('Node app is running on port', config.main.port);
});
