angular.module('services', ['ngResource']).factory('MoveService', ['$resource', function($resource) {
  return $resource('/games/:gameId/moves/:moveId');
}]);
