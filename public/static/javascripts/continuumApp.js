angular.module(
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
    'services'
  ]
).run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}).config(function continuumConfig($routeProvider) {
  $routeProvider
     .when('/', {
       templateUrl: '/main',
       controller: 'StartController',
       controllerAs: 'vm',
       resolve: {
         initialGames: function(GameService) {
           return GameService.query().$promise;
         }
       }
     })
     .when('/lobby/:gameId', {
       templateUrl: function($routeParams) {
         return '/lobby/' + $routeParams.gameId;
       },
       controller: 'LobbyController',
       controllerAs: 'vm',
       resolve: {
         initialGame: function($route, GameService) {
           return GameService.get({gameId: $route.current.params.gameId}).$promise;
         }
       }
     })
     .when('/continuum/:gameId', {
       templateUrl: function($routeParams) {
         return '/continuum/' + $routeParams.gameId;
       },
       controller: 'PlayController',
       controllerAs: 'vm',
       resolve: {
         initialGame: function($route, GameService) {
           return GameService.get({gameId: $route.current.params.gameId}).$promise;
         }
       }
     })
     .otherwise({
       redirectTo: '/'
     });
});
