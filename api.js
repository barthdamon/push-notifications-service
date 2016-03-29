require('dotenv').config({silent: true});

const oddcast = require('oddcast');
const express = require('express');

const service = require('./service');

const bus = oddcast.bus();
const api = express();

bus.requests.use({}, oddcast.inprocessTransport());

service.initialize(bus, {
	redis: {
		uri: process.env.REDIS_URI
	}
});

api.use(service.router(bus));

// if (!module.parent) {
// 	api.listen(process.env.PORT, (err) => {
// 		console.log('Identity API running on port ' + process.env.PORT);
// 	});
// };

module.export = api;
