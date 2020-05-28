'use strict';

factFindApp.directive('chatControl', [function () {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs, ngModel) {
                element.draggable({handle: ""});
                //element.parents('.chat-box').draggable();
            }
        };
    }]);