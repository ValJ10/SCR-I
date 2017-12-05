'use strict';

angular.module('myApp.Players', ['ngRoute'])


    // Make The Routes Players/players.js
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/Players', {
            templateUrl: 'Players/players.html',
            controller: 'PlayerController'
        });
    }])

footballData.factory('teamDetails', function($resource, $http) {
    /**
     * http://api.football-data.org/v1/ resource
     * get details of a single season
     */
    $http.defaults.headers.common['X-Auth-Token'] = 'ADD YOUR API KEY';
    var resource = $resource('http://api.football-data.org/v1/teams/:teamId',
        {teamId:'@teamId'},
            {
                "getTeam": {
                    method: "GET",
                        cache : true,
                        isArray: false
                },
                "getPlayers": {
                        method: "GET",
                        cache : true,
                        isArray: false,
                        url: 'http://api.football-data.org/v1/teams/:teamId/players',
                },
                "getFixtures": {
                        method: "GET",
                        isArray: false,
                        cache : true,
                        url: 'http://api.football-data.org/v1/soccerseasons/:teamId/fixtures'
                }
            }
        );
    return {
        getPlayers: function(teamId) {
            return resource.getPlayers({teamId:teamId});
        },
        getTeam: function(teamId) {
            return resource.getTeam({teamId:teamId});
        },
        getFixtures: function(teamId) {
            return resource.getFixtures({teamId:teamId});
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

.controller('PlayerController',
    function PlayerController($scope,teamDetails, $routeParams, $route, pageAttributes){
        var teamId = $routeParams.teamID;
        $scope.players = [];
        teamDetails.getPlayers(teamId).$promise.then(function(data){
            $scope.players = data.players;
        })
    });
