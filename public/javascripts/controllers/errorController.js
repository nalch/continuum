/**
 * 
 */

var errorController = angular.module('errorController', []);

errorController.controller(
  'errorController',
  [
    '$scope', '$timeout',
    function ($scope, $timeout) {
      $scope.errors = [];
      
      $scope.addError = function (error) {
  		if ($scope.errorsTimeout) {
  		  $timeout.cancel($scope.errorsTimeout);
  		}	  			
  		$scope.errors.push(error);
  		$scope.errorsTimeout = $timeout(function () {
  		  $scope.errors = [];
  		}, 3000);
  	  };
    }
  ]
);