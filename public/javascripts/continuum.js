var continuum = angular.module('continuum', ['ngRoute', 'continuumController', 'xeditable', 'ngAnimate']);

continuum.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

continuum.config(['$routeProvider',
 function($routeProvider) {
   $routeProvider.
     when('/', {
       templateUrl: '/main',
       controller: 'mainController'
     }).
     when('/lobby/:gameId', {
       templateUrl: function($routeParams) {
     	  return '/lobby/' + $routeParams.gameId;
         },
       controller: 'lobbyController'
     }).
     when('/continuum/:gameId', {
	   templateUrl: function($routeParams) {
	 	  return '/continuum/' + $routeParams.gameId;
	     },
	   controller: 'playController'
	 }).
     otherwise({
       redirectTo: '/'
     });
 }]
);