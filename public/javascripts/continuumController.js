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
  }
]);

continuumControllers.controller('playController', ['$scope', '$http', '$routeParams',
  function ($scope, $http, $routeParams) {

	$http.get('/games/' + $routeParams.gameId)
      .success(function(data) {
        $scope.game = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
	
	$scope.setNick = function(data) {
	  $http.put('/players/' + $scope.userId, {'nick': data})
		.success(function(data) {
		  return true;
		})
		.error(function(data) {
		  return 'Could not change nick';
		});
	};
  }
]);