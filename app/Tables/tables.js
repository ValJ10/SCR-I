'use strict';

angular.module('myApp.Tables', ['ngRoute'])


    // Make The Fucking Routes
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/leagueTable', {
            templateUrl: 'Tables/tables.html',
            controller: 'TablesController'
        });
    }])

// this list the seasons . Only use this one for the leagues
.factory('LeagueTable', function($resource, $http) {  
    var data;
    $http.defaults.headers.common['X-Auth-Token'] = 'ADD YOUR API KEY';
    var resource = $resource('http://api.football-data.org/v1/soccerseasons/:leagueId/leagueTable',
        {leagueId:'@leagueId'},
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
        getLeagueTable: function(leagueId) {
            return resource.get({leagueId:leagueId});
        }
    };
})

    // get the fixtures of the league
.factory('seasonDetails', function($resource, $http) {    
    $http.defaults.headers.common['X-Auth-Token'] = '50f1e7e15f1941e98e3e56c2db1f8163 ';
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
                        url: 'http://api.football-data.org/v1/soccerseasons/:singleSeason/fixtures?matchday=:matchID',
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
        getFixtures: function(seasonId, matchID) {
            return resource.getFixtures({singleSeason:seasonId, matchID});
        },
        getLeagueTable: function(seasonId) {
            return resource.getLeagueTable({singleSeason:seasonId});
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


.controller('TablesController',
    function TablesController($scope, $location, LeagueTable, $routeParams, $route, pageAttributes){

        var seasonId = $routeParams.leagueId;
        $scope.sid = seasonId;

        $scope.leagueCaption = '';
        $scope.standings = [];

        LeagueTable.getLeagueTable(seasonId).$promise.then(function(data){
        $scope.leagueCaption = (data.leagueCaption);
        $scope.standings = (data.standing);

        $scope.showPlayers = function(seasonId, index){
            // Getting the teamID is very important its one of the way that we gonna get the players list for
            // Each team. it also helpful to get the next fixtures of the team
            // the RE essentially just takes the last digits in the players. links
            // ex: http://api.football-data.org/v1/teams/73 --> takes 73
            var team = data.standing[index]._links.team.href;
            var teamID = (/(\d+)[^\d]*$/.exec(team)[0]);
            $location.url('Players' + '?teamID=' + teamID);
        };


        
})

// ----------------------------------
// HAVE TO IMPLEMENT THIS SOMEWHERE |
/*                                  |
.$promise.then(function(data){      |
                return data;        |
*/
        
/* 
        $scope.teams = seasonDetails.getTeams(seasonId);

        $scope.fixtures = seasonDetails.getFixtures(seasonId);
        $scope.leagueTable = seasonDetails.getLeagueTable(seasonId);

        $scope.pageAttributes = pageAttributes;
        pageAttributes.setTitle('Season| Football Data Angular');*/

    }

)



// http://api.football-data.org/v1/competitions/426/fixtures?matchday=8
.controller('FixtureController',
    function FixtureController($scope, $location, LeagueTable, seasonDetails, $routeParams, $route, pageAttributes){

        var seasonId = $routeParams.leagueId;
        var matchID = $routeParams.matchID;

        $scope.fixtures = [];
        $scope.matchday = matchID;



        // Find the amount of ganeweeks in the league
            LeagueTable.getLeagueTable(seasonId).$promise.then(function(data){
            $scope.gamesPlayed = (data.matchday);
})



/*
// 
console.log($scope.gamesPlayed);
        // number of total games
        element(by.binding('gamesPlayed')).getText().then(function(value){
            console.log(value);
        })*/
   
        
        // increase the matchday
        $scope.increaseMatch = function(){
            $scope.matchday = parseInt($scope.matchday) + 1;
            $route.updateParams({matchID:$scope.matchday});
        }

         // Find the amount of games that are played in the leagues
        seasonDetails.getFixtures(seasonId, matchID).$promise.then(function(data){
            $scope.fixtures = data.fixtures;
        })


        // decrease the matchdays
        // not quite done yet, it still goes to matchday week 0, which should not happen
        $scope.decreaseMatch = function(){
            if($scope.matchday >= 1 && $scope.matchday !== 0){
                $scope.matchday = parseInt($scope.matchday) - 1;
            }
            $route.updateParams({matchID:$scope.matchday});

        }

        var soccerStreams = require('soccer-streams-scraper')
 
soccerStreams.getMatches().then(res => {
  console.log(res)
})
});
