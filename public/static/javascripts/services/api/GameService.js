angular.module('services', ['ngResource']).factory('GameService', ['$resource', function($resource) {
  return $resource('/api/games/:gameId', {}, {
    patch: {
      method: 'PUT'
    }
  });
}]);
