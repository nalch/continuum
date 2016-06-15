angular.module('ErrorController', []).controller(
  'ErrorController',
  [
    'vm',
    '$timeout',
    function(vm, $timeout) {
      vm.errors = [];

      vm.addError = function(error) {
        vm.errors.push(error);
        $timeout(function() {
          vm.errors.pop(0);
        }, 5000);
      };
    }
  ]
);
