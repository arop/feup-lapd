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

    var stopLatLng = new google.maps.LatLng(document.getElementById("coord").getAttribute("lat"),
      document.getElementById("coord").getAttribute("lon"));

    var mapOptions = {
      center: stopLatLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("stopmap"), mapOptions);

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

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
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


  .controller('TripPlannerMapCtrl', function($scope, $cordovaGeolocation) {
    var options = {timeout: 10000, enableHighAccuracy: true};

    var geocoder = new google.maps.Geocoder;
    var mapOptions = {
      center: new google.maps.LatLng( 41.1483464,-8.6109996 ), //Aliados
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("tripplannermap"), mapOptions);
    initAutocomplete($scope.map, geocoder);

    // start map after getting current position
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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

      });

    }, function(error){
      console.log(error);
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
    };

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

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

/**
 * Get search results from google places API
 */
function initAutocomplete(map) {
  console.log('init autocomplete');
  // START
  // Create the search box and link it to the UI element.
  var inputStart = document.getElementById('pac-input-start');
  var autocompleteStart = new google.maps.places.Autocomplete(inputStart);

  autocompleteStart.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var markerStart = new google.maps.Marker({
      map: map
  });
  google.maps.event.addListener(markerStart, 'click', function() {
      infowindow.open(map, markerStart);
  });


  // Get the full place details when the user selects a place from the
  // list of suggestions.
  google.maps.event.addListener(autocompleteStart, 'place_changed', function() {
    infowindow.close();
    var place = autocompleteStart.getPlace();
    if (!place.geometry) {
        return;
    }
    document.getElementById('startMarker').setAttribute("lat", autocompleteStart.getPlace().geometry.location.lat());
    document.getElementById('startMarker').setAttribute("lon", autocompleteStart.getPlace().geometry.location.lng());

    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    markerStart.setPlace( /** @type {!google.maps.Place} */ ({
        placeId: place.place_id,
        location: place.geometry.location
    }));
    markerStart.setVisible(true);

  });


  // END

  var inputEnd = document.getElementById('pac-input-end');
  var autocompleteEnd = new google.maps.places.Autocomplete(inputEnd);

  autocompleteEnd.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var markerEnd = new google.maps.Marker({
      map: map
  });
  google.maps.event.addListener(markerEnd, 'click', function() {
      infowindow.open(map, markerEnd);
  });


  // Get the full place details when the user selects a place from the
  // list of suggestions.
  google.maps.event.addListener(autocompleteEnd, 'place_changed', function() {
    infowindow.close();
    var place = autocompleteEnd.getPlace();
    if (!place.geometry) {
        return;
    }

    document.getElementById('endMarker').setAttribute("lat", autocompleteEnd.getPlace().geometry.location.lat());
    document.getElementById('endMarker').setAttribute("lon", autocompleteEnd.getPlace().geometry.location.lng());

    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    markerEnd.setPlace( /** @type {!google.maps.Place} */ ({
        placeId: place.place_id,
        location: place.geometry.location
    }));
    markerEnd.setVisible(true);
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

