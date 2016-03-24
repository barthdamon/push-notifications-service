'use strict';

const _ = require('lodash');
const boom = require('boom');
const cryo = require('cryo');
const cache = require('lru-cache')({max: 1000, maxAge: 1000 * 60 * 5});

const ORGANIZATION = 'ORGANIZATION:';
const DEVICE = 'DEVICE:';

module.exports = function requestDeviceOrgAuth(req, res, next) {
	const redis = req.app.get('redis');
	req.identity = req.identity || {};

	if (_.includes(req.accessToken.scope, 'device') || _.includes(req.accessToken.scope, 'devicelink')) {
		const accessToken = req.get('x-access-token');
		const organization = cache.get(ORGANIZATION + accessToken);
		const device = cache.get(DEVICE + accessToken);

		if (organization && device) {
			req.identity = {
				organization,
				device
			};

			next();
		} else {
			redis
				.hgetAsync('identity_device', req.accessToken.deviceID)
				.then(device => {
					req.identity.device = cryo.parse(device);

					cache.set(DEVICE + accessToken, req.identity.device);

					return redis.catalog.hgetAsync('identity_organization', req.identity.device.organization);
				})
				.then(organization => {
					req.identity.organization = cryo.parse(organization);
					req.identity.organization = _.omit(req.identity.organization, ['key', 'secret']);

					cache.set(ORGANIZATION + accessToken, req.identity.organization);

					next();
				})
				.catch(err => {
					if (err) {
						next(boom.unauthorized('Invalid Organization and/or Device'));
					}
				});
		}
	} else {
		next(boom.unauthorized('Invalid AccessToken Scope'));
	}
};
