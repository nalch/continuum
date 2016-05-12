var continuumControllers = angular.module('continuumController', []);

continuumControllers.controller('mainController', ['$scope', '$http', '$location',
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
          $location.path('/play/' + data.publicId);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };
    
    $scope.joinGame = function() {
      $http.get('/games/' + $scope.gameformData.publicId)
        .success(function (data) {
    	  $location.path('/play/' + $scope.gameformData.publicId);
        })
        .error(function (data) { 
          console.log('Error: ' + data);
        });
    };
  }
]);

continuumControllers.controller('playController', ['$scope', '$http', '$routeParams', '$location', '$interval',
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
	
	
  }
]);