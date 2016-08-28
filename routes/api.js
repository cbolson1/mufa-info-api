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


// router.get('/seasons', function(req, res, next) {
// 	res.json(_seasons);
// });

router.get('/leagues/season/:season', function(req, res, next) {
	var season = _.find(_seasons, function(o) { return o.id == req.param('season') });

	var leagues = [];

	request('http://www.sandlotsports.biz/leagues/standings.asp?leagueid='+season.leagueid, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);
	    $('li.dropdown .dropdown-menu a').each(function(i, element){
	    	var rel = $(this).attr('href');
	    	var url = querystring.parse(rel);
	    	leagues.push({id: parseInt(url['?leagueid']), name: $(this).text().trim()});
	    });

	    res.json({name: season.name, leagues: leagues});
	  }
	});

});

router.get('/teams/league/:league', function(req, res, next) {

	var teams = [];

	request('http://www.sandlotsports.biz/leagues/teams.asp?leagueid='+req.param('league'), function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	var $ = cheerio.load(html);
	    $('div.col-xs-12.col-sm-6 a').each(function(i, element){
	    	var rel = $(this).attr('href');
	    	var url = querystring.parse(rel);

	    	var teamName = $(this).text().split('.');
	    	teamName.shift();
	    	teamName = teamName.join('').trim();

	    	teams.push({id: parseInt(url['/teams/?teamId']), name: teamName});
	    });

	    res.json({name: $('h4').text().split('> ')[1], teams: teams});
	  }
	});

});

var swissIds = [599,598];
router.get('/team/league/:league/team/:team', function(req, res, next) {

	var games = [];
	var isSwiss = _.includes(swissIds, parseInt(req.param('league')));

	request('http://www.sandlotsports.biz/teams/?teamid='+req.param('team')+'&leagueid='+req.param('league'), function (error, response, html) {
	  if (!error && response.statusCode == 200) {
	  	var $ = cheerio.load(html);
	    $('#upcomingGames tr').each(function(i, element){
	    	if (i == 0) return;

	    	var cell = $(this).find('td');

	    	var date = cell.eq(0).text().trim();
	    	var our_score = cell.eq(2).text().trim();
	    	var their_score = cell.eq(3).text().trim();
	    	var opponent = cell.eq(4).text().trim();

	    	var team_url = cell.eq(4).find('a').attr('href');
	    	var team_id = querystring.parse(team_url)['/teams/?teamId'];

	    	var field = cell.eq(isSwiss ? 7 : 5).text().split('(')[0].trim();
	    	var game_time = cell.eq(isSwiss ? 8 : 6).text().trim();
	    	var color = cell.eq(isSwiss ? 9 : 7).text().trim();
	    	var location = _.find(_locations, function(l) {
	    		return field.toUpperCase().indexOf(l.regex.toUpperCase()) >= 0;
	    	});
	    	var diagram = cell.eq(5).find('a').eq(2).attr('href');
	    	var WL = cell.eq(1).text().split('c')[0].trim().toUpperCase();

	    	games.push({
	    		date: date || '',
	    		our_score: parseInt(our_score) || '',
	    		their_score: parseInt(their_score) || '',
	    		opponent: opponent || '',
	    		team_id: parseInt(team_id) || '',
	    		field: field || '',
	    		game_time: game_time || '',
	    		color: color || '',
	    		diagram: diagram || '',
	    		location: location || false,
	    		WL: WL
	    	});

	    });
			// filter bad games
			games = games.filter(function(g){
				return g.date != '' || g.game_time != '';
			})

			var teamName = $('#pageName').text().split('(')[0].trim();
	    res.json({name: teamName, games: games});
	  }
	});

});

router.get('/danes', function(req, res, next) {
	res.json(_danes);
});

router.get('/announcements', function(req, res, next) {
	res.json(_announcements);
});

router.get('/locations', function(req, res, next) {
	res.json(_.sortBy(_locations, "name"));
});




module.exports = router;
