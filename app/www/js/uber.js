var base_url_cors = "https://crossorigin.me/"
var base_uber_url = "https://api.uber.com/v1/";
var server_token = "GGNd9ZZenYoa-u3rgXcxUtG2DfBli6WaV3dgoe2n";

angular.module('lapd.uber', ['ngCordova'])

.controller('UberController', function ($scope, $http, $state, $cordovaGeolocation) {
	var options = {timeout: 10000, enableHighAccuracy: true};

	$scope.showUberProducts = false;

	$cordovaGeolocation.getCurrentPosition(options).then(function(position){

		$scope.getProducts = function () {
			var url = base_url_cors + base_uber_url;

			url += 'products?';

			url += 'server_token=' + server_token;

			url += '&latitude=' + position.coords.latitude;
			url += '&longitude=' + position.coords.longitude;

			$http.get(url).success( function(response) {
				console.log(response);
				$scope.uberProducts = response.products;
				
				$scope.showUberProducts = true;
			});
		}
	})
})
