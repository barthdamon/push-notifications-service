'use strict';

const Jwt = require('jsonwebtoken');
const boom = require('boom');

const accessTokenSharedSecret = require('../config').secrets.accessTokenSharedSecret;

function decodeJWT(accessToken, cb) {
	Jwt.verify(accessToken, accessTokenSharedSecret, (err, decodedJWT) => {
		if (err) {
			cb('Invalid Access Token', null);
		} else {
			cb(null, decodedJWT);
		}
	});
}

module.exports = function requestAccessTokenDecode(req, res, next) {
	const accessToken = req.get('x-access-token');

	decodeJWT(accessToken, (err, decodedAccessToken) => {
		if (err) {
			next(boom.badRequest(err));
		} else {
			req.accessToken = decodedAccessToken;
			next();
		}
	});
};
