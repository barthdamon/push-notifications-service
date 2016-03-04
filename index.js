const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');

const AWS = require('aws-sdk');
AWS.config.update(config.aws);

const mongoose = require('mongoose');
mongoose.connect(config.mongodb.uri);

const deviceTokens = require('./routes/device-tokens');
const pushem = require('./routes/pushem');

const app = express();

app.set('aws', AWS);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/device/new', deviceTokens.addToken);
app.post('/notification/push', pushem.sendNotification);

app.listen(config.main.port, () => {
	console.log('Node app is running on port', config.main.port);
});
