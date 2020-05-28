factFindApp.directive('dropdownenter', function () {
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            var code = event.keyCode || event.which;
            if (code === 13) {
                event.preventDefault();
                event.stopPropagation();
                var fields;
                fields = $(this).parents('form:eq(0),body').find('input, textarea, select,div.ui-select-container').not('input.ui-select-focusser,.ui-select-search');

                var index = fields.index(this);
                if (index > -1 && (index + 1) < fields.length) {
                    if (fields.eq(index + 1).hasClass('ui-select-container')) {
                        setTimeout(() => {
                            fields.eq(index + 1).find('.ui-select-focusser').focus();
                        });
                    }
                    else {
                        setTimeout(() => {
                            fields.eq(index + 1).focus();
                        }, 100);
                    }
                }
            }
        });
    };
});
factFindApp.directive('enter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            var code = event.keyCode || event.which;
            if (code === 13) {
                event.preventDefault();
                var fields = $(this).parents('form:eq(0),body').find('input, textarea, select');
                var fields;
                fields = $(this).parents('form:eq(0),body').find('input, textarea, select,div.ui-select-container').not('input.ui-select-focusser,.ui-select-search');

                var index = fields.index(this);
                if (index > -1 && (index + 1) < fields.length) {
                    if (fields.eq(index + 1).hasClass('ui-select-container')) {
                        setTimeout(() => {
                            fields.eq(index + 1).find('.ui-select-focusser').focus();
                        });
                    }
                    else {
                        setTimeout(() => {
                            fields.eq(index + 1).focus();
                        }, 100);
                    }
                }
            }
        });
    };
});
factFindApp.directive('scrollTop', function ($window) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs, ngModel) {
            //$window.scrollTo(0, angular.element('input[type="text"].ng-invalid').offsetTop);
            element.on("click", function () {
                var errorEle = angular.element('input.ng-invalid').first().focus();
                $('html, body').animate({
                    scrollTop: (errorEle[0]) ? $(errorEle).offset().top - 100 : 0
                }, 'slow', function () {
                });
            });
        }
    }
});