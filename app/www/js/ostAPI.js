var base_url_ost = "https://api.ost.pt/";

//var globalTrips = {};

angular.module('lapd.ost', ['ngCordova'])

.controller('TripPlannerController', function ($scope, $http, $state, currentTrip, TripValuesInTripplanner, $stateParams) {

	$scope.showTrip = function () {
		$scope.trips = currentTrip.trips;
	};

	$scope.showTripSteps = function(){
		$scope.trip = currentTrip.trips[$stateParams.index];
	};


	$scope.getTrip = function() {

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
			currentTrip.trips = response.Objects[0].itineraries;

			TripValuesInTripplanner.setValue(startLat,startLon,endLat,endLon);

			$state.go('app.tripplanner.show');
		});
	};

})

.service('currentTrip', function () {
	var currentTrip = this;
	currentTrip.trips = {};
})

.service('TripValuesInTripplanner', function() {
	var tripValues = this;
	tripValues = {};

    this.getTrip = function() {
        return tripValues;
    };

    this.setValue = function(beginLat,beginLon,endLat,endLon) {
        tripValues.beginLat = beginLat;
        tripValues.beginLon = beginLon;
        tripValues.endLat = endLat;
        tripValues.endLon = endLon;
    }
});
