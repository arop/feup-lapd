angular.module('lapd.map', ['ngCordova'])

.controller('MapCtrl', function($scope, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){

        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });      

        var infoWindow = new google.maps.InfoWindow({
          content: "You are here!"
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        });

      });

    }, function(error){
      console.log("Could not get location");
    });
})

.controller('StopMapCtrl', function($scope, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var stopLatLng = new google.maps.LatLng(document.getElementById("coord").getAttribute("lat"),
      document.getElementById("coord").getAttribute("lon"));

    var mapOptions = {
      center: stopLatLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("stopmap"), mapOptions);


      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){

        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        var infoWindow = new google.maps.InfoWindow({
          content: "You are here!"
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        });

        var stopmarker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: stopLatLng
        });      

        var stopInfoWindow = new google.maps.InfoWindow({
          content: "Stop is here!"
        });

        google.maps.event.addListener(stopmarker, 'click', function () {
          stopInfoWindow.open($scope.map, stopmarker);
        });

      });

    }, function(error){
      console.log("Could not get location");
    });
});