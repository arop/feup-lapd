
angular.module('lapd.ost', ['ngCordova'])

.controller('StopsController', function($scope, $http, $cordovaGeolocation){
	$scope.poslat = 0;
	$scope.poslon = 0;
	$scope.range = 0.5;

	$scope.hasPosition = false;

	$scope.getPos = function() {
		$scope.hasPosition = true;
		var options = {timeout: 10000, enableHighAccuracy: true};

		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			$scope.poslat = position.coords.latitude;
			$scope.poslon = position.coords.longitude;
		});

	};


	$scope.getCloseStops = function() {
		var url = "https://api.ost.pt/stops/?";

		url += "center=" + $scope.poslon + "%2C" + $scope.poslat;
		url += "&range=" + $scope.range;
		url += "&withroutes=false&key=wOfLniMzlmTPRoUSOLmLWVyyWpnnNotUsisSFTTF";

		$http.get(url).success( function(response) {
			$scope.stops = response.Objects;
		});
	};

	$scope.numberPickerObject = {
    inputValue: $scope.range, //Optional
    minValue: 0,
    maxValue: 10,
    decimalCharacter: '.',  //Optional
    decimalStep: 0.1,  //Optional
    format: "DECIMAL",  //Optional - "WHOLE" or "DECIMAL"
    titleLabel: 'Range (km)',  //Optional
    setLabel: 'Set',  //Optional
    closeLabel: 'Close',  //Optional
    setButtonType: 'button-positive',  //Optional
    closeButtonType: 'button-stable',  //Optional
    callback: function (val) {    //Mandatory
    	//timePickerCallback(val);
    	$scope.range = val;
    	$scope.getCloseStops();
    }
};

});

