/**
 * New node file
 */

var playController = angular.module('playController', []);

playController.controller(
  'playController',
  [
    '$scope', '$http', '$routeParams', '$location', '$interval', '$timeout',
    function ($scope, $http, $routeParams, $location, $interval, $timeout) {
	  	$scope.location = $location;
	  	$scope.errors = [];
	  	
	  	$scope.isOwner = function () {
	  	  // TODO postpone until game is updated
	  	  if ($scope.game) {
	  	    return $scope.userId === $scope.game.owner.publicId;
	  	  }
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
	  	
	  	$scope.hoverBoard = function (row, column) {
	  	  $scope.activeColumn = column;
	  	  $scope.activeRow = row;
	  	};
	  	
	  	$scope.setMove = function (row, column) {
	  	  $http.post(
	  	    '/games/' + $routeParams.gameId + '/moves',
	  	    {
	  	      'downward': row < 3, 
	  	      'column': column
	  	    }
	  	  ).success(
	  	    function (data) {
	  	      $scope.game.board[data.row][data.column] = data.number % 2 === 1 ? 1 : 2;
	  	    }
	  	  ).error(
	  	    function (error) {
	  	      $scope.addError(error);
	  	    }
	      );
	  	};
	  	
	  	$scope.addError = function (error) {
	  		if ($scope.errorsTimeout) {
	  		  $timeout.cancel($scope.errorsTimeout);
	  		}	  			
	  		$scope.errors.push(error);
	  		$scope.errorsTimeout = $timeout(function () {
	  		  $scope.errors = [];
	  		}, 3000);
	  	};
	  	
	  	$scope.playersTurn = function () {
	  		if (!$scope.game)
	  		  return false;
	  		if ($scope.userId === $scope.game.owner.publicId && $scope.game.moves.length % 2 === 1) {
	  		  return true;
	  		}
	  		
	  		if ($scope.userId === $scope.game.opponent.publicId && $scope.game.moves.length % 2 === 0) {
	  		  return true;
	  		}
	  		
	  		return false;
	  	};
	  	
	  	$scope.updateView = function () {
	        $http.get('/games/' + $routeParams.gameId)
	          .success(function (data) {
	            $scope.game = data;
	            
	            $scope.rows = Array.apply(
	              null,
	              new Array(data.board.numRows)).map(function (_, i) {return i;}
	            );
	            $scope.columns = Array.apply(
	              null,
	              new Array(data.board.numCols)).map(function (_, i) {return i;}
	            );
	          	
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
	  	
	}
  ]
);
