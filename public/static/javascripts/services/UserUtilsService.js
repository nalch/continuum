angular.module('services').factory('UserUtilsService', ['UserService', function(UserService) {
  return {
    setNick: function(userId, nick, errorhandler) {
      UserService.patch(
        {publicId: userId},
        {nick: nick},
        function() {},
        errorhandler
      );
    }
  };
}]);
