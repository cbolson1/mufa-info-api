var express 	= require('express'),
	cheerio 	= require('cheerio'),
	request 	= require('request'),
	_ 			= require('lodash'),
	querystring = require('querystring'),
	router 		= express.Router();


var _seasons 		= require('../data/seasons'),
	_locations 		= require('../data/locations'),
	_danes 			= require('../data/danes'),
	_announcements 	= require('../data/announcements');



router.get('/announcements', function(req, res, next) {
	res.json(_announcements.filter(function(a){
		return a.version !== 1;
	}));
});

module.exports = router;
