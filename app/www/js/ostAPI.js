var base_url_ost = "https://api.ost.pt/";

angular.module('lapd.ost', ['ngCordova'])

  .controller('TripPlannerController', function ($scope, $http, $state, $stateParams, $templateCache,
    ionicLoadingService, connectionProblemPopup, currentTrip, TripValuesInTripplanner) {

  

    $scope.showTrip = function () {
      $scope.trips = currentTrip.trips;
    };

    $scope.showTripSteps = function(){
      $scope.trip = currentTrip.trips[$stateParams.index];
    };

    $scope.getTrip = function() {
      ionicLoadingService.showLoading();

      var d = new Date();
      var n = d.getTimezoneOffset();
      var strftimeHere = strftime.timezone(-n);

      var url = base_url_ost + 'trips/plan/';
      url += '?optimize=QUICK';
      url += '&time=' + encodeURIComponent(strftimeHere('%T%P', d));
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
      
      $http({
        method: 'GET',
        url: url,
        cache: $templateCache})
        .then(
          function(response) {
            currentTrip.trips = response.data.Objects[0].itineraries;
            ionicLoadingService.hideLoading();
            TripValuesInTripplanner.setValue(startLat,startLon,endLat,endLon);
            $state.go('app.tripplanner.show');
          },
          function(response) {
            ionicLoadingService.hideLoading();
            connectionProblemPopup.showRetry($scope.getTrip);
          }
        );
    };

    // AUTO COMPLETE LONG PRESS ISSUE WORKAROUND 
    $scope.disableTapStart = function() {
      console.log('abc');
        var container = document.getElementsByClassName('pac-container');
        console.log(container);
        angular.element(container).attr('data-tap-disabled', 'true');
        var backdrop = document.getElementsByClassName('backdrop');
        angular.element(backdrop).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('pac-input-start').blur();
        });
    };

    $scope.disableTapEnd = function() {
        var container = document.getElementsByClassName('pac-container');
        console.log(container);
        angular.element(container).attr('data-tap-disabled', 'true');
        var backdrop = document.getElementsByClassName('backdrop');
        angular.element(backdrop).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('pac-input-end').blur();
        });
    };
    // END OF AUTO COMPLETE LONG PRESS ISSUE WORKAROUND

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
