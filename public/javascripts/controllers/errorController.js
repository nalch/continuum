/**
 *
 */

var errorController = angular.module('errorController', []);

errorController.controller(
  'errorController',
  function ($scope, $timeout) {
    $scope.errors = [];

    $scope.addError = function (error) {
      $scope.errors.push(error);
      $timeout(function () {
        $scope.errors.pop(0);
      }, 5000);
    };
  }
);
