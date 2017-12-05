'use strict';

// Declare app level module which depends on views, and components
var footballData = angular.module('myApp', [
  'ngRoute',
  'myApp.Leagues',
  'myApp.Tables',
  'myApp.Players',
  'myApp.version',
  'ngResource',
  //'ngMaterial',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/season/2016'});
}]);
