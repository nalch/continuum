/**
 * 
 */

var startController = angular.module('startController', []);

startController.controller(
  'startController',
  function ($scope, $http, $location, GameService) {
    $scope.formData = {};
    
    $scope.createGame = function() {
      $http.post('/games', $scope.gameformData)
        .success(function(data) {
          $location.path('/lobby/' + data.publicId);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };
    
    $scope.joinGame = function() {
      GameService.get({gameId: '/games/' + $scope.gameformData.publicId}, function() {
        $location.path('/lobby/' + $scope.gameformData.publicId);
      });
    };
  }
);