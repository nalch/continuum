/**
 * 
 */

var lobbyController = angular.module('lobbyController', []);

lobbyController.controller(
  'lobbyController',
  [
    '$scope', '$http', '$routeParams', '$location', '$interval',
    function ($scope, $http, $routeParams, $location, $interval) {
		$scope.location = $location;
		
		$scope.isOwner = function () {
		  return $scope.userId === $scope.game.owner.publicId; 
		};
		
		$scope.setNick = function (data) {
	      $http.put('/players/' + $scope.userId, {'nick': data})
			.success(function (data) {
			  return true;
			})
			.error(function (data) {
			  return 'Could not change nick';
			});
		};
		
		$scope.challengeUser = function (visitor) {
		  $http.put('/games/' + $routeParams.gameId, {opponentId: visitor.publicId})
		  .success(function (data) {
			$scope.game.opponent = visitor;
	      })
	      .error(function (data) {
	        console.log('Error: ' + data);
	      });
		};
		
		$scope.updateView = function () {
	      $http.get('/games/' + $routeParams.gameId)
	        .success(function (data) {
	          $scope.game = data;
	        })
	        .error(function (data) {
	          console.log('Error: ' + data);
	        });
		};
		
		$scope.startViewUpdate = function () {
		  $scope.updateView();
		  $scope.heartbeat = $interval($scope.updateView, 5000);	
		};
		
		$scope.stopViewUpdate = function () {
			$interval.cancel($scope.heartbeat);
		};
		
		$scope.startViewUpdate();
		
		$scope.$on('$destroy', function() {
	      $scope.stopViewUpdate();
	    });
		
		$scope.startGame = function() {
		  $location.path('/continuum/' + $routeParams.gameId);
		};
		
	}
  ]
);