var markerEndGlobal; // used in trip planner

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

  $scope.start_address = '';
  $scope.end_address = '';

  // start map after getting current position
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var geocoder = new google.maps.Geocoder;

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("tripplannermap"), mapOptions);

    initAutocomplete($scope.map, markerEndGlobal, geocoder);

      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){

        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        var infoWindowCurrent = new google.maps.InfoWindow({
          content: "You are here!"
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindowCurrent.open($scope.map, marker);
        });

        var markerStart = new google.maps.Marker({
          map: $scope.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        var infoWindowStart = new google.maps.InfoWindow({
          content: "Start here!"
        });

        google.maps.event.addListener(markerStart, 'click', function () {
          infoWindowStart.open($scope.map, markerStart);

          markerStart.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

          document.getElementById('startMarker').setAttribute("lat", marker.position.lat());
          document.getElementById('startMarker').setAttribute("lon", marker.position.lng());

          geocodeLatLng(geocoder, 'start');
        });

        google.maps.event.addListener( markerStart, 'dragend', function(){
          google.maps.event.trigger(this, 'click');} );

      });

      //Add or replace end marker on click
      google.maps.event.addListener($scope.map, 'click', function(event) {
        placeMarker(event.latLng, $scope.map);
        geocodeLatLng(geocoder, 'end');

        google.maps.event.addListener( markerEndGlobal, 'dragend', function(){
          google.maps.event.trigger(this, 'click');
          document.getElementById('endMarker').setAttribute("lat", markerEndGlobal.position.lat());
          document.getElementById('endMarker').setAttribute("lon", markerEndGlobal.position.lng());
          geocodeLatLng(geocoder, 'end');
        } );

      });


    }, function(error){
      console.log("Could not get location");
    });
})

.controller('TripShowWalkStepCtrl', function($scope, $cordovaGeolocation, currentTrip, $stateParams){
    var from = currentTrip.trips[$stateParams.index].legs[$stateParams.step_index].from;
    var to = currentTrip.trips[$stateParams.index].legs[$stateParams.step_index].to;

    var from_coords = new google.maps.LatLng(from.lat, from.lon);
    var   to_coords = new google.maps.LatLng(  to.lat,   to.lon);

    var mapOptions = {
      center: from_coords,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var request = {
      origin: from_coords,
      destination: to_coords,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC
    }

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();


    //document.getElementById('trip-walk-step-map').style.height = document.getElementById('trip-walk-step-map-container').clientHeight+'px';
    document.getElementById('trip-walk-step-map').style.height =
      (window.innerHeight - document.getElementsByTagName('ion-header-bar')[0].offsetHeight)+'px';
    document.getElementById('trip-walk-step-map').style.width  = document.getElementById('trip-walk-step-map-container').clientWidth+'px';

    $scope.map = new google.maps.Map(document.getElementById("trip-walk-step-map"), mapOptions);
    directionsDisplay.setMap($scope.map);

    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      }
    });

})

function placeMarker(location, map) {
  if(markerEndGlobal != null) {
    markerEndGlobal.setMap(null);
  }

  markerEndGlobal = new google.maps.Marker({
    position: location,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP
  });

  var infoWindow = new google.maps.InfoWindow({
    content: "End trip here!"
  });

  google.maps.event.addListener(markerEndGlobal, 'click', function () {
    infoWindow.open(map, markerEndGlobal);
  });

  markerEndGlobal.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

  document.getElementById('endMarker').setAttribute("lat", markerEndGlobal.position.lat());
  document.getElementById('endMarker').setAttribute("lon", markerEndGlobal.position.lng());
}


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function initAutocomplete(map, currentEndMarker, geocoder) {
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input-end');
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
        content: "End trip here!"
      });

      google.maps.event.addListener(markerEnd, 'click', function () {
        infoWindow.open(map, markerEnd);
        document.getElementById('endMarker').setAttribute("lat", markerEnd.position.lat());
        document.getElementById('endMarker').setAttribute("lon", markerEnd.position.lng());

        currentEndMarker = markerEnd;
        currentEndMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        geocodeLatLng(geocoder, 'end');
      });

      google.maps.event.addListener( markerEnd, 'dragend', function(){
        google.maps.event.trigger(this, 'click');} );

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


/**
* Display street name where marker is set
*/
function geocodeLatLng(geocoder, startOrEnd) {
  var lat = "";
  var lon = "";

  if(startOrEnd === 'start') {
    lat = document.getElementById('startMarker').getAttribute("lat");
    lon = document.getElementById('startMarker').getAttribute("lon");
  } else {
    lat = document.getElementById('endMarker').getAttribute("lat");
    lon = document.getElementById('endMarker').getAttribute("lon");
  }

  var latlng = {lat: parseFloat(lat), lng: parseFloat(lon)};

  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        if(startOrEnd === 'start') {
          document.getElementById('startName').innerHTML = results[0].formatted_address;
        } else {
          document.getElementById('endName').innerHTML = results[0].formatted_address;
        }
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

