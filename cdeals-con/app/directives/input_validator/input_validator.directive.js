factFindApp.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {onlyDigits: '='},
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');
//                    if (digits.length > 2) {
//                        digits = digits.substring(0, scope.onlyDigits);
//                    }
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
factFindApp.directive('onlyDecimalDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {onlyDecimalDigits: '='},
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9.]/g, '');
                    if (digits.split('.').length > 2) {
                        digits = digits.substring(0, digits.length - 1);
                    }
                    if(digits.length == 2) {
                        digits = digits + '.';
                    }
                    if (digits.length > 2) {
                        digits = digits.substring(0, scope.onlyDecimalDigits);
                    }
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseFloat(digits);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
factFindApp.directive('onlyAlphabet', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {onlyAlphabet: '='},
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^A-z_ ]/g, '');
                    if (digits.length > 2) {
                        digits = digits.substring(0, scope.onlyAlphabet);
                    }
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return digits;
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
factFindApp.directive('onlyAlphaNumeric', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {onlyAlphaNumeric: '='},
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^A-Za-z0-9.@_ ]/g, '');
                    if (digits.length > 2) {
                        digits = digits.substring(0, scope.onlyAlphaNumeric);
                    }
                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return digits;
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
factFindApp.directive('onlyDecimalNumber', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            element.number( true, 2 );
        }
    };
});
factFindApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
       
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(value) {
                if (value) {
                  
                   var transformedInput = ("" + value).replace(/[^0-9.]/g, '');
         //         var transformedInput = value.replace(/^\s+|\s+$/g,'');
                 //   console.log('replacingofvalues',transformedInput);    
                    if (transformedInput !== value) {
                       ngModelCtrl.$setViewValue(transformedInput);
                       ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
factFindApp.directive('onlyTwoDigits', function () {
    return {
        require: 'ngModel',
       
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(value) {
                if (value) {
                  
                    var transformedInput = ("" + value).replace(/[^0-9]/g, '');
                    //   var transformedInput = value.replace(/^\s+|\s+$/g,'');
                    //   console.log('replacingofvalues',transformedInput);
                    if(transformedInput.length > 1){
                        transformedInput = transformedInput.slice(0,2);
                    }    
                    if (transformedInput !== value) {
                       ngModelCtrl.$setViewValue(transformedInput);
                       ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
factFindApp.directive('ageLimits', function(){
    return{
        require: 'ngModel',

        link: function(scope, element, attr, ngModelCtrl){
            function fromUser(val){

                if(val){
                    var transInput = (""+val).replace(/[^0-9]/g,'');
                    if(transInput.length > 2){
                        transInput = transInput.slice(0,3);
                    }
                    if(transInput !== val){
                        ngModelCtrl.$setViewValue(transInput);
                        ngModelCtrl.$render();
                    }
                    return transInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
factFindApp.directive('onlyYears', function(){
    return{
        require: 'ngModel',

        link: function(scope, element, attr, ngModelCtrl){
            function fromUser(val){

                if(val){
                    var transInput = (""+val).replace(/[^0-9]/g,'');
                    if(transInput.length > 3){
                        transInput = transInput.slice(0,4);
                    }
                    if(transInput !== val){
                        ngModelCtrl.$setViewValue(transInput);
                        ngModelCtrl.$render();
                    }
                    return transInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
factFindApp.directive('focusMe', function($timeout) {
    return {
      scope: { trigger: '=focusMe' },
      link: function(scope, element) {
        scope.$watch('trigger', function(value) {
          if(value === true) { 
            //console.log('trigger',value);
            //$timeout(function() {
              element[0].focus();
              scope.trigger = false;
            //});
          }
        });
      }
    };
});