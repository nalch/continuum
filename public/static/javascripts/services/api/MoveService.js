angular.module('services').factory('MoveService', ['$resource', function($resource) {
  return $resource('/games/:gameId/moves/:moveId');
}]);
