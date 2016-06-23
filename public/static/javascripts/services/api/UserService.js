angular.module('services').factory('UserService', ['$resource', function($resource) {
  return $resource('/api/players/:publicId', {}, {
    patch: {
      method: 'PUT'
    }
  });
}]);
