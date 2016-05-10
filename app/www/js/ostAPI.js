var base_url_ost = "https://api.ost.pt/";

angular.module('lapd.ost', ['ngCordova'])

.controller('TripPlannerController', function ($scope, $http, $state) {

	this.trip = {};

	$scope.getTrip = function() {

		//var strftime = require('strftime') //not required in browsers

		var d = new Date();
		var n = d.getTimezoneOffset();
		var strftimeHere = strftime.timezone(-n);

		var url = base_url_ost + 'trips/plan/';
		url += '?optimize=QUICK';

		url += '&time=' + encodeURIComponent(strftimeHere('%T %P', d));

		url += '&arriveBy=false';

		var startLat = document.getElementById('startMarker').getAttribute("lat");
		var startLon = document.getElementById('startMarker').getAttribute("lon");

		var endLat = document.getElementById('endMarker').getAttribute("lat");
		var endLon = document.getElementById('endMarker').getAttribute("lon");

		url += '&fromPlace=' + startLat + '%2C' + startLon;
		url += '&toPlace=' + endLat + '%2C' + endLon;

		url += '&date=' + encodeURIComponent(strftimeHere('%F', d));

		url += '&mode=TRANSIT%2CWALK';

		url += '&key=wOfLniMzlmTPRoUSOLmLWVyyWpnnNotUsisSFTTF';

		$http.get(url).success( function(response) {
			trip = response.Objects;

			$state.go('app.tripplanner.show');

			console.log(url);
			console.log(response);
		});
	};

	$scope.showTrip = function () {
		console.log(trip);
		$scope.trip = trip;
	};
});
