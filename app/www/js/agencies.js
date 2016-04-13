angular.module('lapd.agencies', [])

.controller('AgenciesController', function($scope, $http){
	var url = "http://localhost:8080/exist/agencies.xql";

	$http.get(url).success( function(response) {
		var x2js = new X2JS();
		var json = x2js.xml_str2json( response );
		$scope.agencies = json.agencies.agency;
	});
	
});
