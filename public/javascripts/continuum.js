var continuum = angular.module('continuum', ['ui.router']);

continuum.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');
	
    $stateProvider
      .state('main',
        {
    	  url: '/',
    	  templateUrl: '/main',
    	  controller: 'mainController'
        }
      )
      .state('play',
        {
    	  url: '/play/:gameId',
          templateUrl: function($stateParams) {
        	  return '/continuum/' + $stateParams.gameId;
          },
          controller: 'playController'
        }
      );
  }
]);

function mainController($scope, $http, $state) {
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
            	console.log(data.publicId);
                $state.transitionTo('play', {'gameId': data.publicId});
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}

function playController($scope, $http, $state, $stateParams) {
	$http.get('/games/' + $stateParams.gameId)
      .success(function(data) {
        $scope.game = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
	
	$scope.setNick = function() {
		$http.put('/players/' + $scope.game.owner.publicId, {'nick': 'krsc'})
		  .success(function(data) {
			console.log('setnick');
		  })
		  .error(function(data) {
			console.log('Error: ' + data);
		  });
	}
}