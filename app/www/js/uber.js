var base_url_cors = "https://crossorigin.me/"
var base_uber_url = "https://api.uber.com/v1/";
var server_token = "GGNd9ZZenYoa-u3rgXcxUtG2DfBli6WaV3dgoe2n";

angular.module('lapd.uber', ['ngCordova', 'lapd.ost'])

.controller('UberController', function ($scope, $http, $state, ionicLoadingService, connectionProblemPopup, TripValuesInUber) {

	var geocoder = new google.maps.Geocoder;

	$scope.showEstimate = false;

	$scope.getEstimates = function () {
		var tripFromPlanner = TripValuesInUber.getTrip();

		if(tripFromPlanner.endLat != undefined) {
			ionicLoadingService.showLoading();

			var url = base_url_cors + base_uber_url;

			url += 'estimates/price?';

			url += 'server_token=' + server_token;

			url += '&start_latitude=' + tripFromPlanner.beginLat;
			url += '&start_longitude=' + tripFromPlanner.beginLon;
			url += '&end_latitude=' + tripFromPlanner.endLat;
			url += '&end_longitude=' + tripFromPlanner.endLon;


			$http.get(url).success( function(response) {
				$scope.estimates = response.prices;

				//get names
				geocodeLatLngInUber(geocoder, tripFromPlanner);
				$scope.showEstimate = true;

				ionicLoadingService.hideLoading();
			});

		}
		else console.log("null trip");
	}
})

.service('TripValuesInUber', function(TripValuesInTripplanner) {
	this.getTrip = function() {
		return TripValuesInTripplanner.getTrip();
	};
})


/**
* Display street name of destination from trip
*/
function geocodeLatLngInUber(geocoder, currentTrip) {

	var latlngBegin = {lat: parseFloat(currentTrip.beginLat), lng: parseFloat(currentTrip.beginLon)};
	var latlngEnd = {lat: parseFloat(currentTrip.endLat), lng: parseFloat(currentTrip.endLon)};

	geocoder.geocode({'location': latlngBegin}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				//document.getElementById('startNameTripUber').innerHTML = results[0].formatted_address;
				document.getElementById('startNameTripUber').value = results[0].formatted_address;

			} else {
				window.alert('No results found');
			}
		} else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});

	geocoder.geocode({'location': latlngEnd}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				//document.getElementById('endNameTripUber').innerHTML = results[0].formatted_address;
				document.getElementById('endNameTripUber').value = results[0].formatted_address;
			} else {
				window.alert('No results found');
			}
		} else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});
}
