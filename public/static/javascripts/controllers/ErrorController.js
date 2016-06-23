angular.module('ErrorController', []).controller(
  'ErrorController',
  [
    'vm',
    '$timeout',
    function(vm, $timeout) {
      vm.errors = [];

      vm.addError = function(error) {
        vm.errors.unshift(error);
        $timeout(function() {
          vm.errors.pop();
        }, 5000);
        return false;
      };
    }
  ]
);
