angular.module('services', ['ngResource']).factory('GameService', ['$resource', function($resource) {
  return $resource('/games/:gameId');
}]);
