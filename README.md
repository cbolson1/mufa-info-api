# Mufa Info API

This is the API that powers the Mufa Info Android/iOS application, but it can also be used to power other applications.

#### Setup
Pull repo  
`npm install`  
Start server `npm start`  
API will be live at `localhost:3000/api/v1/seasons`


#### Contributions

Contributions are welcome in the form of pull requests. Anything that is not backwards comatible must be versioned (`api/v#`). The issues section is a good place to check for bugs or enhancements that could use help.

### Endpoints

All endpoints are prepended by `/api` and a version (currently `/v1`). So you can find the current seasons with `localhost:3000/api/v1/seasons`.

Seasons: `/seasons`  
Gets current seasons

Leagues `/leagues/season/:season`  
Gets leagues for season

Teams `/teams/league/:league`  
Gets teams for league

Games `/team/league/:league/team/:team`  
Gets game information for team

Great Danes `/danes`  
Gets Great Dane information

Fields/Locations `/locations`  
Get field locations



