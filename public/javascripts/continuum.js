var continuum = angular.module('continuum', ['ngRoute', 'continuumController', 'xeditable']);

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
     when('/play/:gameId', {
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