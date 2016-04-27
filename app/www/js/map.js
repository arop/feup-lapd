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
})

.controller('TripPlannerMapCtrl', function($scope, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("tripplannermap"), mapOptions);

    initAutocomplete($scope.map);

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

        var markerStart = new google.maps.Marker({
          map: $scope.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        var infoWindow1 = new google.maps.InfoWindow({
          content: "Start here!"
        });

        google.maps.event.addListener(markerStart, 'click', function () {
          infoWindow1.open($scope.map, markerStart);
          document.getElementById('startLat').innerHTML = markerStart.position.lat();
          document.getElementById('startLon').innerHTML = markerStart.position.lng();
        });

      });

    }, function(error){
      console.log("Could not get location");
    });
})

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function initAutocomplete(map) {
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var markerEnd = new google.maps.Marker({
        map: map,
        title: place.name,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "Get here!"
      });


      google.maps.event.addListener(markerEnd, 'click', function () {
        infoWindow.open(map, markerEnd);
        document.getElementById('endMarker').setAttribute("lat", markerEnd.position.lat());
        document.getElementById('endMarker').setAttribute("lon", markerEnd.position.lng());

        document.getElementById('endLat').innerHTML = markerEnd.position.lat();
        document.getElementById('endLon').innerHTML = markerEnd.position.lng();
      });

      // Create a marker for each place.
      markers.push(markerEnd);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  });
}