// Ionic lapd App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'lapd' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lapd', ['ionic','lapd.map','lapd.existdb', 'lapd.ost', 'lapd.uber', 'ionic-numberpicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.agencies', {
    url: '/agencies',
    views: {
      'menuContent': {
        templateUrl: 'templates/agencies.html',
        controller: 'AgenciesController'
      }
    }
  })

  .state('app.uber', {
    url: '/uber',
    views: {
      'menuContent': {
        templateUrl: 'templates/uber.html',
        controller: 'UberController'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchController'
      }
    }
  })

  .state('app.stop.schedule', {
    url: '/schedule/:route_id',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/stop_schedule.html',
        controller: 'StopsController'
      }
    }
  })

  .state('app.stop', {
    url: '/stop/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/stop.html',
        controller: 'StopsController'
      }
    }
  })

  .state('app.route', {
    url: '/route/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/route.html',
        controller: 'RoutesController'
      }
    }
  })

  .state('app.tripplanner', {
    url: '/tripplanner',
    views: {
      'menuContent': {
        templateUrl: 'templates/trip_planner.html',
        controller: 'TripPlannerController'
      }
    }
  })

  .state('app.tripplanner.show', {
    url: '/show',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/trip_itinerary.html',
        controller: 'TripPlannerController'
      }
    }
  })

  .state('app.tripplanner.show.steps', {
    url: '/steps/:index',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/trip_steps.html',
        controller: 'TripPlannerController'
      }
    }
  })

  .state('app.tripplanner.show.steps.walk', {
    url: '/walk/:step_index',
    views: {
      'menuContent@app': {
        templateUrl: 'templates/trip_step_walk.html',
        controller: 'TripShowWalkStepCtrl'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
