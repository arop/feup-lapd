var base_url = 'http://cloud.joaonorim.eu:22000/exist/feup-lapd/xql';
//var base_url = 'http://localhost:8080/exist/lapd';

angular.module('lapd.existdb', ['ngCordova'])

.controller('AgenciesController', function($scope, $http){
	var url = base_url + "/agencies.xql";

	$http.get(url).success( function(response) {
		var x2js = new X2JS();
		var json = x2js.xml_str2json( response );

		$scope.agencies = json.result.agency;
	});
	
})

.controller('StopsController', function($scope, $stateParams, $http, $cordovaGeolocation){
	$scope.poslat = 0;
	$scope.poslon = 0;
	$scope.range = 0.5;

	$scope.hasPosition = false;

	$scope.stop = {};

	$scope.getPos = function() {
		$scope.hasPosition = true;
		var options = {timeout: 10000, enableHighAccuracy: true};

		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			$scope.poslat = position.coords.latitude;
			$scope.poslon = position.coords.longitude;
		});

	};

	$scope.getCloseStops = function() {
		var url = base_url + "/stops_nearby.xql?";

		url += "lon=" + $scope.poslon;
		url += "&lat=" + $scope.poslat;
		url += "&rng=" + $scope.range;

		$http.get(url).success( function(response) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( response );
			$scope.stops = json.result.stop;
		});
	};

	$scope.getStop = function() {
		var url = base_url + "/stop.xql?";

		url += "id=" + $stateParams.id;

		$http.get(url).success( function(response) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( response );
			$scope.stop = json.result.stop;
			console.log(json);
		});
	};

	$scope.getStopSchedule = function() {
		var url = base_url + "/stop-route-schedule.xql?";

		url += "stop_id=" + $stateParams.id + "&route_id=" + $stateParams.route_id;

		$http.get(url).success( function(response) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( response );
			$scope.schedule = json.result.route;
			
			var stoptimes = [];
			var stoptimes_temp = json.result.route.stoptime;
			console.log(stoptimes_temp);
			for (var stoptime in stoptimes_temp){
				if(stoptimes_temp[stoptime].arrival_time !== undefined){
					stoptimes.push(stoptimes_temp[stoptime].arrival_time);
				}
				else{
					var prev_seq = stoptimes_temp[stoptime].previous_stop._stop_sequence;
					var next_seq = stoptimes_temp[stoptime].next_stop._stop_sequence;
					var want_seq = stoptimes_temp[stoptime].wanted_stop._stop_sequence;

					stoptimes.push(stoptimes_temp[stoptime].previous_stop.__text + ' - previous stop');
				}
			}
			$scope.schedule = uniq(stoptimes);
			console.log($scope.schedule);
		});
	};

	$scope.numberPickerObject = {
    inputValue: $scope.range, //Optional
    minValue: 0,
    maxValue: 100,
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

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}