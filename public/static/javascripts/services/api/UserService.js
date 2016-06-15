angular.module('services').factory('UserService', ['$resource', function($resource) {
  return $resource('/players/:publicId', {}, {
    patch: {
      method: 'PUT'
    }
  });
}]);
