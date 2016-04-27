var base_url_ost = "https://api.ost.pt/";

angular.module('lapd.ost', ['ngCordova'])

.controller('TripPlannerController', function ($scope, $http) {
	$scope.getTrip = function() {
		var url = base_url_ost;

		/*url += "center=" + $scope.poslon + "%2C" + $scope.poslat;
		url += "&range=" + $scope.range;
		url += "&withroutes=false&key=wOfLniMzlmTPRoUSOLmLWVyyWpnnNotUsisSFTTF";*/

		$http.get(url).success( function(response) {
			$scope.stops = response.Objects;
		});
	};
});
