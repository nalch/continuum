var continuumApp = angular.module(
  'continuum',
  [
    'ngRoute',
    'xeditable',
    'ngAnimate',
    'ErrorController',
    'GameUpdateController',
    'StartController',
    'LobbyController',
    'PlayController',
    'services',
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
       controller: 'StartController',
       resolve: {
         initialGames: function(GameService) {
           return GameService.query().$promise;
         }
       }
     }).
     when('/lobby/:gameId', {
       templateUrl: function($routeParams) {
          return '/lobby/' + $routeParams.gameId;
         },
       controller: 'LobbyController',
       resolve: {
         initialGame: function($route, GameService) {
           return GameService.get({gameId: $route.current.params.gameId}).$promise;
         }
       }
     }).
     when('/continuum/:gameId', {
       templateUrl: function($routeParams) {
          return '/continuum/' + $routeParams.gameId;
         },
       controller: 'PlayController',
       resolve: {
         initialGame: function($route, GameService) {
           return GameService.get({gameId: $route.current.params.gameId}).$promise;
         }
       }
     }).
     otherwise({
       redirectTo: '/'
     });
 }]
);
