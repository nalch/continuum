angular.module('services').factory('MoveService', ['$resource', function($resource) {
  return $resource('/api/games/:gameId/moves/:moveId');
}]);
