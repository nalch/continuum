angular.module('services', ['ngResource']).factory('GameService', function($resource) {
  return $resource('/games/:gameId');
});
