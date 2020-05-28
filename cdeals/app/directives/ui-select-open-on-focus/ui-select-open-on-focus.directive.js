'use strict';
angular.module('factFindApp').directive('uiSelectOpenOnFocus', ['$timeout', function($timeout){
  return {
    require: 'uiSelect',
    restrict: 'A',
    link: function($scope, el, attrs, uiSelect) {
      var closing = false;

      angular.element(uiSelect.focusser).on('focus', function() {
        if(!closing) {
          uiSelect.activate();
        }
      });

      // Because ui-select immediately focuses the focusser after closing
      // we need to not re-activate after closing
      $scope.$on('uis:close', function() {
        closing = true;
        $timeout(function() { // I'm so sorry
          closing = false;
        },100);
      });
    }
  };
}]);