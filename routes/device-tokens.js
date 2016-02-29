'use strict';

var express = require('express');
var app = express();

// //MARK: MODULES
var platformEndpoint = require('./platform-endpoint.js');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV;
mongoose.connect(env == "development" ? 'mongodb://localhost/odd-push' : process.env.PROD_MONGODB);

//MARK: MODELS
var deviceSchema = mongoose.Schema({
	token: String,
	platform: String
});
var DeviceToken = mongoose.model('DeviceToken', deviceSchema);

//MARK ROUTES
exports.addToken = function(req, res) {
	var newToken = req.body.token;
	var platform = req.body.platform;
	if (newToken && platform) {
		var newDevice = new DeviceToken({
			token: newToken,
			platform: platform
		});
		newDevice.save(function(err) {
			if (err) {
				res.status(400).json({ "message": "notification token registration failure: " + err });
			} else {	
				platformEndpoint.createPlatformEndpoint(platform, newToken).then(function(data) {
					res.status(200).json({ "message": "notification token registration successful" });
				}).catch(function(err) {
					res.status(400).json({"message": "notification token registration failure: " + err});
				});
			}
		});
	} else {
		res.status(400).json({ "message": "invalid request format"});		
	}
}