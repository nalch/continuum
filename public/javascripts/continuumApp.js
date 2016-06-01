var continuumApp = angular.module(
  'continuum',
  [
    'ngRoute',
    'xeditable',
    'ngAnimate',
    'errorController',
    'startController',
    'lobbyController',
    'playController'
  ]
);

continuumApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

continuumApp.config(['$routeProvider',
 function($routeProvider) {
   $routeProvider.
     when('/', {
       templateUrl: '/main',
       controller: 'startController'
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