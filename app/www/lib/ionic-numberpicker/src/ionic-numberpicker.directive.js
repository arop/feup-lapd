//By Milk Can LLC
//https://github.com/milkcan

(function () {
  'use strict';

  angular.module('ionic-numberpicker')
    .directive('ionicNumberpicker', ionicNumberpicker);

  ionicNumberpicker.$inject = ['$ionicPopup'];
  function ionicNumberpicker($ionicPopup) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        inputObj: "=inputObj"
      },
      link: function (scope, element, attrs) {

        //set up base variables and options for customization
        scope.inputValue = scope.inputObj.inputValue ? scope.inputObj.inputValue : 0;
        scope.minValue = typeof(scope.inputObj.minValue !== 'undefined') ? scope.inputObj.minValue : -9007199254740991;
        scope.maxValue = typeof(scope.inputObj.maxValue !== 'undefined') ? scope.inputObj.maxValue : 9007199254740991;
        scope.format = scope.inputObj.format ? scope.inputObj.format : 'DECIMAL';
        scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Number Picker';
        scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
        scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
        scope.decimalStep = scope.inputObj.decimalStep ? scope.inputObj.decimalStep : .25;
        scope.decimalCharacter = scope.inputObj.decimalCharacter ? scope.inputObj.decimalCharacter : '.';
        scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
        scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';

        scope.wholeNumber = 0;
        scope.decimalNumber = 0;
        scope.numericValue = scope.wholeNumber + '.' + scope.decimalNumber;

        //Changing the style
        scope.changeFormat = function () {
          scope.format = (scope.format === "DECIMAL") ? "WHOLE" : "DECIMAL";
        };

        scope.decimalDisplay = function() {
          var sValue = scope.decimalNumber.toString();
          var index = sValue.indexOf(".");
          return sValue.substring(index + 1);
        }

        //Increasing the whole number
        scope.increaseWhole = function () {
          scope.wholeNumber = Number(scope.wholeNumber);
          scope.wholeNumber += 1;
          scope.numericValue = scope.wholeNumber + scope.decimalNumber;

          scope.checkMax();
        };

        //Decreasing the whole number
        scope.decreaseWhole = function () {
          scope.wholeNumber = Number(scope.wholeNumber);
          scope.wholeNumber -= 1;
          scope.numericValue = scope.wholeNumber + scope.decimalNumber;

          scope.checkMin();
        };

        //Increasing the decimal number
        scope.increaseDecimal = function () {
          scope.decimalNumber = Number(scope.decimalNumber);
          scope.decimalNumber += scope.decimalStep;

          if (scope.decimalNumber >= 1) {
            scope.wholeNumber += 1;
            scope.decimalNumber -= 1;
          }

          scope.numericValue = scope.wholeNumber + scope.decimalNumber;

          scope.checkMax();
        };

        //Decreasing the decimal number
        scope.decreaseDecimal = function () {
          scope.decimalNumber = Number(scope.decimalNumber);
          scope.decimalNumber -= scope.decimalStep;

          if (scope.decimalNumber < 0) {
            scope.wholeNumber -= 1;
            scope.decimalNumber += 1;
          }

          scope.numericValue = scope.wholeNumber + scope.decimalNumber;

          scope.checkMin();
        };

        //Make sure number is not too high
        scope.checkMax = function() {
          if (scope.numericValue >= scope.maxValue) {
            scope.numericValue = scope.maxValue;
            scope.wholeNumber = Math.floor(scope.numericValue);
            scope.decimalNumber = scope.numericValue % 1;
          }
        }

        //Make sure number is not too low
        scope.checkMin = function() {
          console.log("VALUE:" + scope.numericValue + ", MINVAL:" + scope.minValue);
          if (scope.numericValue <= scope.minValue) {
            scope.numericValue = scope.minValue;
            scope.wholeNumber = Math.floor(scope.numericValue);
            scope.decimalNumber = scope.numericValue % 1;
          }
        }

        //onclick of the button
        element.on("click", function () {
          if (scope.format == 'DECIMAL') {

            //Get Values from Initial Number
            scope.wholeNumber = Math.floor(scope.inputValue);
            scope.decimalNumber = scope.inputValue % 1;

            $ionicPopup.show({
              templateUrl: 'ionic-numberpicker-decimal.html',
              title: scope.titleLabel,
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: scope.closeLabel,
                  type: scope.closeButtonType,
                  onTap: function (e) {
                    scope.inputObj.callback(undefined);
                  }
                },
                {
                  text: scope.setLabel,
                  type: scope.setButtonType,
                  onTap: function (e) {
                    scope.loadingContent = true;
        
                    scope.numericValue = scope.wholeNumber + scope.decimalNumber;
                    scope.inputObj.callback(scope.numericValue);
                  }
                }
              ]
            });

          } else {
            //Get Values from Initial Number
            scope.wholeNumber = Math.floor(scope.inputValue);
            scope.decimalNumber = 0;

            $ionicPopup.show({
              templateUrl: 'ionic-numberpicker-whole.html',
              title: scope.titleLabel,
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: scope.closeLabel,
                  type: scope.closeButtonType,
                  onTap: function (e) {
                    scope.inputObj.callback(undefined);
                  }
                },
                {
                  text: scope.setLabel,
                  type: scope.setButtonType,
                  onTap: function (e) {
                    scope.loadingContent = true;

                    scope.inputObj.callback(scope.wholeNumber);
                  }
                }
              ]
            });
          }
        });
      }
    };
  }
})();