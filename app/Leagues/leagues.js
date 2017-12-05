'use strict';

angular.module('myApp.Leagues', ['ngRoute'])


    // Make The Fucking Routes
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/season/:singleSeason', {
            templateUrl: 'Leagues/leagues.html',
            controller: 'LeaguesController'
        });
    }])

    
    // gives the teams, fixtures and the league table
    .factory('seasonDetails', function($resource, $http) {
    
    $http.defaults.headers.common['X-Auth-Token'] = 'ADD YOUR API KEY';
    var resource = $resource('http://api.football-data.org/v1/soccerseasons/:singleSeason',
        {singleSeason:'@singleSeason'},
            {
                "getTeams": {
                        method: "GET",
                        cache : true,
                        isArray: false,
                        url: 'http://api.football-data.org/v1/soccerseasons/:singleSeason/teams',
                },
                "getFixtures": {
                        method: "GET",
                        isArray: false,
                        cache : true,
                        url: 'http://api.football-data.org/v1/soccerseasons/:singleSeason/fixtures'
                },
                "getLeagueTable": {
                        method: "GET",
                        isArray: false,
                        cache : true,
                        url: 'http://api.football-data.org/v1/soccerseasons/:singleSeason/leagueTable'
                }
            }
        );
    return {
        getTeams: function(seasonId) {
            return resource.getTeams({singleSeason:seasonId});
        },
        getFixtures: function(seasonId) {
            return resource.getFixtures({singleSeason:seasonId});
        },
        getLeagueTable: function(seasonId) {
            return resource.getLeagueTable({singleSeason:seasonId});
        }
    };



})


// this list the seasons . Only use this one for the leagues
.factory('listSeasons', function($resource, $http) {
   
    $http.defaults.headers.common['X-Auth-Token'] = 'ADD YOUR API KEY';
    var resource = $resource('http://api.football-data.org/v1/soccerseasons/?:singleSeason',
        {singleSeason:'@singleSeason'},
            {
                "query": {method: "GET",
                        cache : true,
                        isArray: true
                    },
                "get": {method: "GET",
                        isArray: false,
                        cache : true
                    }
            }
        );
    return {
        getSeason: function(seasonId) {
            return resource.get({singleSeason:seasonId});
        },
        getAllSeasons: function(seasonYear) {
            return resource.query({season: seasonYear});
        }
    };
})

// give the attributes
.factory('pageAttributes', function(){
  var title = 'Football Data Angular';
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = newTitle; }
  };
})


.controller('LeaguesController',
    function LeaguesController($scope, $location, listSeasons, seasonDetails, $routeParams, $route, pageAttributes){

       var seasonYear = $route.current.pathParams.singleSeason; 

       $scope.year = seasonYear;

       $scope.leagues = [];

        // GET ALL THE DATA FOR THE YEAR OF SEASON YEAR
        $scope.seasons = listSeasons.getAllSeasons(seasonYear);
        $scope.leagues = ($scope.seasons);

        // Val : we need a way to keep track of the leagues identification. So we can use it for the next step.
        // Extra parameter so we can do more damage lets go

        $scope.showLeagueTable = function(league){
            $location.url('leagueTable' + '?leagueId=' + league + '&' +'matchID=' + 1);
        };

/* 
        $scope.singleSeason = listSeasons.getSeason(seasonId);




        $scope.teams = seasonDetails.getTeams(seasonId);

        $scope.fixtures = seasonDetails.getFixtures(seasonId);
        $scope.leagueTable = seasonDetails.getLeagueTable(seasonId);

        $scope.pageAttributes = pageAttributes;
        pageAttributes.setTitle('Season| Football Data Angular');*/

    }

);
