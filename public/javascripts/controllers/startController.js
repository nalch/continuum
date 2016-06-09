/**
 * 
 */

var startController = angular.module('startController', []);

startController.controller(
  'startController',
  [
    '$scope', '$http', '$location',
  function ($scope, $http, $location) {
    $scope.formData = {};
    
    $http.get('/games')
        .success(function(data) {
            $scope.games = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

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
      $http.get('/games/' + $scope.gameformData.publicId)
        .success(function (data) {
          $location.path('/lobby/' + $scope.gameformData.publicId);
        })
        .error(function (data) { 
          console.log('Error: ' + data);
            });
        };
    }
  ]
);