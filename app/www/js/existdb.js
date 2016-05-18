var base_url = 'http://cloud.joaonorim.eu:22000/exist/feup-lapd/xql';
//var base_url = 'http://localhost:8080/exist/lapd';

angular.module('lapd.existdb', ['ngCordova'])

.controller('AgenciesController', function($scope, $http, $ionicLoading){
	var url = base_url + "/agencies.xql";

	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
		maxWidth: 200,
		showDelay: 0
	});

	$http.get(url).success( function(response) {

		var x2js = new X2JS();
		var json = x2js.xml_str2json( response );

		$scope.agencies = json.result.agency;

		$ionicLoading.hide();
	});
})

.service('currentStop', function () {
	var currentStop = this;
	currentStop.stop = {};
})

.service('currentRoute', function () {
	var currentRoute = this;
	currentRoute.route = {};
})

.controller('StopsController', function($scope, $stateParams, $http, $cordovaGeolocation, $ionicLoading, currentStop){
	if($scope.stop === undefined) $scope.stop = {};

	$scope.getStop = function() {
		$scope.stop = currentStop.stop;
	};

	$scope.getStopFromExistdb = function() {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});


		var url = base_url + "/stop.xql?";

		url += "id=" + $stateParams.id;

		$http.get(url).success( function(response) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( response );
			$scope.stop = json.result.stop;

			$ionicLoading.hide();
		});
	};

	$scope.getStopSchedule = function() {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		var url = base_url + "/stop-route-schedule.xql?";

		url += "stop_id=" + $stateParams.id + "&route_id=" + $stateParams.route_id;

		$http.get(url).success( function(response) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( response );
			$scope.schedule = json.result.route;

			var stoptimes = [];
			var stoptimes_temp = json.result.route.stoptime;
			//console.log(stoptimes_temp);

			for (var stoptime in stoptimes_temp){
				if(stoptimes_temp[stoptime].arrival_time !== undefined){
					stoptimes.push(stoptimes_temp[stoptime].arrival_time);
				}
				else{
					var prev_seq = stoptimes_temp[stoptime].previous_stop._stop_sequence;
					var next_seq = stoptimes_temp[stoptime].next_stop._stop_sequence;
					var want_seq = stoptimes_temp[stoptime].wanted_stop._stop_sequence;

					var prev_time_split = stoptimes_temp[stoptime].previous_stop.__text.split(':');
					var prev_time = new Date(2000, 0, 1, prev_time_split[0], prev_time_split[1], prev_time_split[2], 0).getTime();

					var next_time_split = stoptimes_temp[stoptime].next_stop.__text.split(':');
					var next_time = new Date(2000, 0, 1, next_time_split[0], next_time_split[1], next_time_split[2], 0).getTime();

					var factor = (want_seq - prev_seq) / (next_seq - prev_seq);
					var time_dif = next_time - prev_time;

					var want_time = new Date(prev_time + factor * time_dif);

					stoptimes.push(
						(want_time.getHours() > 9 ? '' : '0') + want_time.getHours() + ':' +
						(want_time.getMinutes() > 9 ? '' : '0') + want_time.getMinutes() + ':00' + ' ~');
				}
			}
			$scope.schedule = uniq(stoptimes);
			//console.log($scope.schedule);

			$ionicLoading.hide();

		});
	};
})

.controller('RoutesController', function($scope, $stateParams, $http, $ionicLoading, currentRoute) {

	$scope.getStopsOfRoute = function() {
		$scope.route = currentRoute.route;

		var url = base_url + "/stops-by-route.xql?";

		url += "route_id=" + $stateParams.id;

		$http.get(url).success( function(response) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( response );
			$scope.stops = json.result.stop;
			console.log(json);
		});
	};
})

.controller('SearchController', function($scope, $state, $http, $cordovaGeolocation, $ionicLoading, currentStop, currentRoute){
	if($scope.poslat === undefined) $scope.poslat = 0;
	if($scope.poslon === undefined) $scope.poslon = 0;
	if($scope.range === undefined) $scope.range = 1.0;

	if($scope.hasPosition === undefined) $scope.hasPosition = false;
	if($scope.showNearStops === undefined) $scope.showNearStops = false;

	var _text = "";
	var _by = "";
	$scope.searchOptions = ['Stop','Route'];

	$scope.search = {
		text: function(newText) { return arguments.length ? (_text = newText) : _text; },
		by: function(newBy) { return arguments.length ? (_by = newBy) : _by; }
	};


	$scope.search = function() {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		var url = "";

		if($scope.search.by === "Stop") {
			url = base_url + "/search-stop-name.xql?";
			url += "search=" + $scope.search.text;

			$http.get(url).success( function(response) {
				var x2js = new X2JS();
				var json = x2js.xml_str2json( response );
				$scope.searchResultStops = [].concat(json.result.stop);
				$scope.showNearStops = false;
				$scope.showResults = true;

				$ionicLoading.hide();

			});

		} else if($scope.search.by === "Route") {
			url = base_url + "/search-route-name.xql?";
			url += "search=" + $scope.search.text;

			$http.get(url).success( function(response) {
				var x2js = new X2JS();
				var json = x2js.xml_str2json( response );
				$scope.searchResultRoutes = [].concat(json.result.route);
				$scope.showNearStops = false;
				$scope.showResults = true;
				$ionicLoading.hide();

			});
		}
	};

	$scope.getPos = function() {
		$scope.hasPosition = true;
		var options = {timeout: 10000, enableHighAccuracy: true};

		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			$scope.poslat = position.coords.latitude;
			$scope.poslon = position.coords.longitude;
		});
	};

	$scope.viewStop = function(stop) {
		currentStop.stop = stop;

		$state.go('app.stop',{'id' : stop.id});
	};

	$scope.viewRoute = function(route) {
		currentRoute.route = route;

		$state.go('app.route',{'id' : route.id});
	};

	$scope.getCloseStops = function() {
		$ionicLoading.show({
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 200,
			showDelay: 0
		});

		var url = base_url + "/stops_nearby.xql?";

		url += "lon=" + $scope.poslon;
		url += "&lat=" + $scope.poslat;
		url += "&rng=" + $scope.range;

		$http.get(url).success( function(response) {
			var x2js = new X2JS();
			var json = x2js.xml_str2json( response );
			$scope.stops = json.result.stop;

			$ionicLoading.hide();

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
	    setLabel: 'Search',  //Optional
	    closeLabel: 'Close',  //Optional
	    setButtonType: 'button-calm',  //Optional
	    closeButtonType: 'button-stable',  //Optional
	    callback: function (val) {    //Mandatory
	    	//timePickerCallback(val);
	    	if(val == undefined)
	    		$scope.range = 1.0;
	    	else
	    		$scope.range = val;
	    	$scope.getCloseStops();
	    	$scope.showResults = false;
	    	$scope.showNearStops = true;
	    }
	};

	$scope.searchMode = { text: "Stops Near You?", checked: true };

	$scope.clearResults = function () {
		$scope.showResults = false;
		$scope.showNearStops = false;
	}
});


function uniq(a) {
	return a.sort().filter(function(item, pos, ary) {
		return !pos || item != ary[pos - 1];
	})
}
