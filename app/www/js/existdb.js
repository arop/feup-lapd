var base_url = 'http://cloud.joaonorim.eu:22000/exist/feup-lapd/xql';
//var base_url = 'http://localhost:8080/exist/lapd';

angular.module('lapd.existdb', ['ngCordova'])

  .controller('HelpController', function($scope){
  $scope.questions = [];
  $scope.questions.push({question: "To plan a trip do I need to know the stops' name?", answer: "No, you can introduce an address, a zip code, a establishment, a place, etc. We will give to you the near stops to those places."});
  $scope.questions.push({question: "How can I add or remove a route/stop from favorites?", answer: "Open the route/stop that you want add or remove from favourites and in the top right corner you'll find a star. If the star is empty that route/stop is not in favourites, otheerwise is in favourites."});
  $scope.questions.push({question: "Uber estimates are given by EZ Trip?", answer: "No. Uber estimates are given by Uber itself."});
  $scope.questions.push({question: "Can I buy tickets to travel in bus and train through the application?", answer: "No. You'll have to buy the tickets with the respective companies."});

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleQuestion = function(question) {
    if ($scope.isQuestionShown(question)) {
      $scope.shownQuestion = null;
    } else {
      $scope.shownQuestion = question;
    }
  };
  $scope.isQuestionShown = function(question) {
    return $scope.shownQuestion === question;
  };
})
  .controller('AgenciesController', function($scope, $http, $templateCache, ionicLoadingService, connectionProblemPopup){
    var url = base_url + "/agencies.xql";

    $scope.getAgencies = function () {
      ionicLoadingService.showLoading();

      $http({
        method: 'GET',
        url: url,
        cache: $templateCache})
        .then(function(response) {
          var x2js = new X2JS();
          var json = x2js.xml_str2json( response.data );

          $scope.agencies = json.result.agency;

          ionicLoadingService.hideLoading();

        }, function(response) {
          ionicLoadingService.hideLoading();

          connectionProblemPopup.showRetry($scope.getAgencies);
        });
    };
  })

  .service('currentStop', function () {
    var currentStop = this;
    currentStop.stop = {};
  })

  .service('currentRoute', function () {
    var currentRoute = this;
    currentRoute.route = {};
  })

  .service('favorites', function (){
    var favorites = this;

    favorites.initialize = function (){
      var empty_favorites = {'stops' : {}, 'routes': {}, 'trips': {}};
      //window.localStorage.setItem('favorites', JSON.stringify(empty_favorites));
      if(window.localStorage.getItem('favorites') === undefined || window.localStorage.getItem('favorites') == null){
        window.localStorage.setItem('favorites', JSON.stringify(empty_favorites));
      }
    };

    // STOPS 
    favorites.addStop = function (stop){
      favorites.initialize();
      var favorites_temp = JSON.parse(window.localStorage.getItem('favorites'));
      favorites_temp.stops[stop.id] = stop;
      window.localStorage.setItem('favorites', JSON.stringify(favorites_temp));
    };

    favorites.removeStop = function (stop){
      favorites.initialize();
      var favorites_temp = JSON.parse(window.localStorage.getItem('favorites'));
      delete favorites_temp.stops[stop.id];
      window.localStorage.setItem('favorites', JSON.stringify(favorites_temp));
    };

    /**
     *	return true if stop exists in favorites and false otherwise.
     */
    favorites.stopExists = function(stop){
      favorites.initialize();
      var favorites_temp = JSON.parse(window.localStorage.getItem('favorites'));
      return favorites_temp.stops[stop.id] !== undefined;
    }


    // ROUTES
    favorites.addRoute = function (route){
      favorites.initialize();
      var favorites_temp = JSON.parse(window.localStorage.getItem('favorites'));
      favorites_temp.routes[route.id] = route;
      window.localStorage.setItem('favorites', JSON.stringify(favorites_temp));
    };

    favorites.removeRoute = function (route){
      favorites.initialize();
      var favorites_temp = JSON.parse(window.localStorage.getItem('favorites'));
      delete favorites_temp.routes[route.id];
      window.localStorage.setItem('favorites', JSON.stringify(favorites_temp));
    };

    /**
     *	return true if stop exists in favorites and false otherwise.
     */
    favorites.routeExists = function(route){
      favorites.initialize();
      var favorites_temp = JSON.parse(window.localStorage.getItem('favorites'));
      return favorites_temp.routes[route.id] !== undefined;
    }


    // GETS

    favorites.getStops = function (){
      favorites.initialize();
      return JSON.parse(window.localStorage.getItem('favorites')).stops;
    }

    favorites.getRoutes = function (){
      favorites.initialize();
      return JSON.parse(window.localStorage.getItem('favorites')).routes;
    }

    favorites.getAll = function () {
      favorites.initialize();
      return JSON.parse(window.localStorage.getItem('favorites'));
    }
  })

  .controller('StopsController', function($scope, $stateParams, $http, $cordovaGeolocation, ionicLoadingService, $templateCache, currentStop, favorites, connectionProblemPopup){
    $scope.stop_in_favorites = false;
    if($scope.stop === undefined) $scope.stop = {};

    $scope.addStopToFavorites = function (){
      favorites.addStop($scope.stop);
      $scope.stop_in_favorites = true;
    };

    $scope.removeStopFromFavorites = function(){
      favorites.removeStop($scope.stop);
      $scope.stop_in_favorites = false;
    };

    $scope.getStop = function() {
      $scope.stop = currentStop.stop;
      $scope.stop_in_favorites = favorites.stopExists($scope.stop);
    };

    $scope.getStopFromExistdb = function() {
      ionicLoadingService.showLoading();

      var url = base_url + "/stop.xql?";

      url += "id=" + $stateParams.id;

      $http({
        method: 'GET',
        url: url,
        cache: $templateCache})
        .then(function(response) {
          var x2js = new X2JS();
          var json = x2js.xml_str2json( response.data );
          $scope.stop = json.result.stop;
          ionicLoadingService.hideLoading();

        }, function(response) {
          ionicLoadingService.hideLoading();

          connectionProblemPopup.showRetry($scope.getStopFromExistdb);
        });
    };

    $scope.getStopSchedule = function() {
      ionicLoadingService.showLoading();

      var url = base_url + "/stop-route-schedule.xql?";
      url += "stop_id=" + $stateParams.id + "&route_id=" + $stateParams.route_id;

      $http({
        method: 'GET',
        url: url,
        cache: $templateCache})
        .then(function(response) {

          var x2js = new X2JS();
          var json = x2js.xml_str2json( response.data );
          $scope.schedule = json.result.route;

          var stoptimes = [];
          var stoptimes_temp = json.result.route.stoptime;

          for (var stoptime in stoptimes_temp){
            if(stoptimes_temp[stoptime].arrival_time !== undefined){
              stoptimes.push(stoptimes_temp[stoptime].arrival_time);
            }
            else{
              var prev_seq = stoptimes_temp[stoptime].previous_stop._stop_sequence;
              var next_seq = stoptimes_temp[stoptime].next_stop._stop_sequence;
              var want_seq = stoptimes_temp[stoptime].wanted_stop._stop_sequence;

              var prev_time_split = stoptimes_temp[stoptime].previous_stop.__text.split(':');
              var prev_time = new Date(2000, 0, 1, prev_time_split[0], prev_time_split[1], prev_time_split[2], 0).getTime();

              var next_time_split = stoptimes_temp[stoptime].next_stop.__text.split(':');
              var next_time = new Date(2000, 0, 1, next_time_split[0], next_time_split[1], next_time_split[2], 0).getTime();

              var factor = (want_seq - prev_seq) / (next_seq - prev_seq);
              var time_dif = next_time - prev_time;

              var want_time = new Date(prev_time + factor * time_dif);

              stoptimes.push(
                (want_time.getHours() > 9 ? '' : '0') + want_time.getHours() + ':' +
                (want_time.getMinutes() > 9 ? '' : '0') + want_time.getMinutes() + ':00' + ' ~');
            }
          }
          $scope.schedule = uniq(stoptimes);

          ionicLoadingService.hideLoading();

        }, function(response) {
          ionicLoadingService.hideLoading();

          connectionProblemPopup.showRetry($scope.getStopSchedule);
        });
    };
  })

  .controller('RoutesController', function($scope, $stateParams, $http, $templateCache, ionicLoadingService, connectionProblemPopup, currentRoute, favorites) {
	$scope.route_in_favorites = favorites.routeExists(currentRoute.route);

  	$scope.addRouteToFavorites = function (){
  	  favorites.addRoute(currentRoute.route);
  	  $scope.route_in_favorites = true;
  	};

  	$scope.removeRouteFromFavorites = function(){
  	  favorites.removeRoute(currentRoute.route);
  	  $scope.route_in_favorites = false;
  	};


    $scope.getStopsOfRoute = function() {
      ionicLoadingService.showLoading();

      $scope.route = currentRoute.route;
      var url = base_url + "/stops-by-route.xql?";
      url += "route_id=" + $stateParams.id;

      $http({
        method: 'GET',
        url: url,
        cache: $templateCache})
        .then(

          function(response) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json( response.data );
            $scope.stops = json.result.stop;
            ionicLoadingService.hideLoading();
          },
          function(response) {
            ionicLoadingService.hideLoading();

            connectionProblemPopup.showRetry($scope.getStopsOfRoute);
          });
    };
  })

  .controller('FavoritesController', function($scope, $state, currentStop, currentRoute, favorites){
    $scope.favorites = favorites.getAll();
    console.log($scope.favorites);
    $scope.viewStop = function(stop) {
      currentStop.stop = stop;
      $state.go('app.stop',{'id' : stop.id});
    };

    $scope.viewRoute = function(route) {
      currentRoute.route = route;
      $state.go('app.route',{'id' : route.id});
    };
  })

  .controller('SearchController', function($scope, $state, $http, $cordovaGeolocation, ionicLoadingService, connectionProblemPopup, currentStop, currentRoute, $templateCache){
    if($scope.poslat === undefined) $scope.poslat = 0;
    if($scope.poslon === undefined) $scope.poslon = 0;
    if($scope.range === undefined) $scope.range = 1.0;

    if($scope.hasPosition === undefined) $scope.hasPosition = false;
    if($scope.showNearStops === undefined) $scope.showNearStops = false;

    var _text = "";
    var _by = "";
    $scope.searchOptions = ['Stop','Route'];

    $scope.search = {
      text: function(newText) { return arguments.length ? (_text = newText) : _text; },
      by: function(newBy) { return arguments.length ? (_by = newBy) : _by; }
    };


    $scope.search = function() {
      ionicLoadingService.showLoading();

      var url = "";

      if($scope.search.by === "Stop") {
        url = base_url + "/search-stop-name.xql?";
        url += "search=" + $scope.search.text;
        $http({
          method: 'GET',
          url: url,
          cache: $templateCache})
          .then(function(response) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json( response.data );

            $scope.searchResultStops = [].concat(json.result.stop);
            $scope.showNearStops = false;
            $scope.showResults = true;
            ionicLoadingService.hideLoading();

          }, function(response) {
            ionicLoadingService.hideLoading();

            connectionProblemPopup.showRetry($scope.search);
          });

      } else if($scope.search.by === "Route") {
        url = base_url + "/search-route-name.xql?";
        url += "search=" + $scope.search.text;

        $http({
          method: 'GET',
          url: url,
          cache: $templateCache})
          .then(function(response) {
            var x2js = new X2JS();
            var json = x2js.xml_str2json( response.data );
            $scope.searchResultRoutes = [].concat(json.result.route);
            $scope.showNearStops = false;
            $scope.showResults = true;
            ionicLoadingService.hideLoading();

          }, function(response) {
            ionicLoadingService.hideLoading();
            connectionProblemPopup.showRetry($scope.search);
          });
      }
    };

    $scope.getPos = function() {

      var options = {timeout: 10000, enableHighAccuracy: true};

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        $scope.poslat = position.coords.latitude;
        $scope.poslon = position.coords.longitude;
        $scope.hasPosition = true;
      });
    };

    $scope.viewStop = function(stop) {
      currentStop.stop = stop;
      $state.go('app.stop',{'id' : stop.id});
    };

    $scope.viewRoute = function(route) {
      currentRoute.route = route;
      $state.go('app.route',{'id' : route.id});
    };

    $scope.getCloseStops = function() {
      ionicLoadingService.showLoading();

      var url = base_url + "/stops_nearby.xql?";

      url += "lon=" + $scope.poslon;
      url += "&lat=" + $scope.poslat;
      url += "&rng=" + $scope.range;

      $http({
        method: 'GET',
        url: url,
        cache: $templateCache})
        .then(function(response) {
          var x2js = new X2JS();
          var json = x2js.xml_str2json( response.data );
          $scope.stops = json.result.stop;
          ionicLoadingService.hideLoading();
        }, function(response) {
          ionicLoadingService.hideLoading();
          connectionProblemPopup.showRetry($scope.getCloseStops);
        });
    };

    $scope.numberPickerObject = {
      inputValue: $scope.range, //Optional
      minValue: 0,
      maxValue: 100,
      decimalCharacter: '.',  //Optional
      decimalStep: 0.1,  //Optional
      format: "DECIMAL",  //Optional - "WHOLE" or "DECIMAL"
      titleLabel: 'Range (km)',  //Optional
      setLabel: 'Search',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-calm',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        //timePickerCallback(val);
        if(val == undefined)
          $scope.range = 1.0;
        else $scope.range = val;

        $scope.getCloseStops();
        $scope.showResults = false;
        $scope.showNearStops = true;
      }
    };

    $scope.searchMode = { text: "Stops Near You?", checked: true };

    $scope.clearResults = function () {
      $scope.showResults = false;
      $scope.showNearStops = false;
    }
  });


function uniq(a) {
  return a.sort().filter(function(item, pos, ary) {
    return !pos || item != ary[pos - 1];
  })
}
