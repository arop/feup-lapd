angular.module('lapd.map', ['ngCordova'])

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
          position: latLng,
          icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22,22),
            new google.maps.Point(0,18),
            new google.maps.Point(11,11))
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
    document.getElementById('tripplannermap').style.height =
      (window.innerHeight
        - document.getElementsByTagName('ion-header-bar')[0].offsetHeight
        - document.getElementById('trip_planner_form_container').offsetHeight)+'px';
    document.getElementById('tripplannermap').style.width = '100%';

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
          position: latLng,
          icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22,22),
            new google.maps.Point(0,18),
            new google.maps.Point(11,11))
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

    document.getElementById('trip-walk-step-map').style.height =
      (window.innerHeight - document.getElementsByTagName('ion-header-bar')[0].offsetHeight)+'px';
    document.getElementById('trip-walk-step-map').style.width  =
      document.getElementById('trip-walk-step-map-container').clientWidth+'px';

    $scope.map = new google.maps.Map(document.getElementById("trip-walk-step-map"), mapOptions);
    directionsDisplay.setMap($scope.map);

    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      }
    });

  })

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
