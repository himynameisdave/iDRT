///////////////////////////////////////////////////////////////
////                   ____    ____   _______              ////
////                  |    \  |    \     |                 ////
////                o |     | |     |    |                 ////
////                  |     | |____/     |                 ////
////                | |     | |   \      |                 ////
////                | |     | |    |     |                 ////
////                | |____/  |    |     |                 ////
////                                                       ////
///////////////////////////////////////////////////////////////




var app = angular.module('app', ['ui.router']);


app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
      .state('mobile', {
        url: "/",
        templateUrl: "partials/mobile.html"
      })
      .state('desktop', {
        url: "/desktop",
        templateUrl: "partials/desktop.html",
        controller: 'DesktopCtrl'
      })
});

//  Not much to see here, other than the sweet redirect to desktop if needed
app.controller('Controller', function ($scope, $state, $log) {


  var init = function(){

    //  Transport off to the desktop site if its not a mobile device
    //  to aid development, we're only checking resolutions/widths
    // if( !isMobileDevice() || !$scope.smellsLikeAMobileDevice() ){
    if( !$scope.smellsLikeAMobileDevice() ){
      $state.go('desktop');
    }
    $scope.activeTemplate = 'partials/main.html';
  }

  var isMobileDevice = function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }else{
      return false;
    }
  };
  $scope.smellsLikeAMobileDevice = function(){
    var w = $(window).width(),
      h = $(window).height();

    if( w > 767 || h > 767 ){
      return false
    }else{
      return true
    }
  };


  $scope.getSched = function(sched){
    $scope.activeTemplate = 'partials/sched-view.html';
  };

  $scope.backToMain = function(){
    $scope.activeTemplate = 'partials/main.html';
  };

  $(document).ready(init);
});


//  just for the mobiles in the house
//  this where the goods at
app.controller('MobileCtrl', function ($scope, $state, $log, $http){

    //  These are the two data objects
    $scope.regions = [];
    $scope.routes = {};


    $scope.routesList = [];
    $scope.activeRoutes = [];
    $scope.selected = {};

    //  check if we already grabbed that route data
   /* if(localStorage.routesData){

      var data = JSON.parse(localStorage.routesData);
      var now = new Date,
          now = Date.parse()
      //  if the data hasn't been reset in awhile, go ahead and re-grab it
      if( daysSince(data.date, now) > 30 ){
        $log.log('Resetting le data, its been > 30 days!')
        getRouteData($http, $scope);
      }else{
        //  Regions is an array of region names, capitalized
        $scope.regions = data.regions;
        //  routes is an object which contains each of the region's associated routes
        $scope.routes = data.routes;
      }

    }else{*/
      getRouteData($http, $scope);
    /*
    };//end getting/setting route data*/

    ////////////////////////////////////////////
    //                STEP ONE                //
    //            Select a region             //
    ////////////////////////////////////////////

    $scope.pickedNewRegion = function(){

      //  reset 'child' selections to undefinded
      $scope.selected.route = undefined;
      $scope.selected.directional = undefined;
      $scope.selected.routePickedAlready = undefined;
      $scope.selected.showBtns = undefined;

      if( $scope.selected.region != undefined ){
          //  our selected region needs to be lowercased cause its stored capitalized
          var selReg = $scope.selected.region.toLowerCase();
          //  set the active routes object
          $scope.activeRoutes = $scope.routes[selReg];

          //  to reset the routes list
          //  routesList is a human-readable list of
          $scope.routesList = [];
          //  loop through each route that matches that region
          $.each( $scope.routes[selReg], function(i, val){
              $scope.routesList.push(val.num + ' - ' + val.name);
          });

        }//end if there is a selected region
    };

    ////////////////////////////////////////////
    //                STEP TWO                //
    //            Select a route              //
    ////////////////////////////////////////////

    $scope.pickedNewRoute = function(){
      //  reset 'child' selections to undefinded
      $scope.selected.directional = undefined;
      $scope.selected.routePickedAlready = undefined;
      $scope.selected.showBtns = undefined;

      //  reset daysList, which becomes the list of avail days
      //  TODO: if there is only one available, then just show the btns
      $scope.daysList = [];

      //  If they actually picked something
      if( $scope.selected.route != undefined ){

          //  get out days list, as well as set the...
          //  THIS SHOULD RETURN THE OBJECT THAT IS THE SELECTED ROUTE, AND
          $scope.routeData = setProperRoute( $scope.selected.route, $scope.activeRoutes );

          //  if we need to deal with direction first
          if($scope.routeData.direction){
            $scope.selected.directional = true;
            $scope.dirList = $scope.routeData.directions;
            // $scope.selected.routePickedAlready = undefined; // undeed cause done above
          }else{
            $scope.selected.routePickedAlready = true;
            //  Set the dayslist to that one
            $scope.daysList = $scope.routeData.sched.days_list;
          }

      }
    };

    ////////////////////////////////////////////
    //               STEP TWO (B)             //
    //            Select a direction          //
    ////////////////////////////////////////////

    $scope.pickedNewDirection = function(){
      $scope.selected.showBtns = undefined;
      if( $scope.selected.direction != undefined ){

        //  this is the direction, lowercased for object notation.
        var d = $scope.selected.direction.toLowerCase();
        //  this sets the list to that specific direction, as done above
        $scope.daysList = $scope.routeData[d].days_list;

        $scope.selected.routePickedAlready = true;

      }
    };


    ////////////////////////////////////////////
    //               STEP THREE               //
    //              Select a day              //
    ////////////////////////////////////////////

    $scope.pickedNewDay = function(){
      if( $scope.selected.day != undefined ){

        $scope.activeSched = configSchedUrl( $scope.routeData, $scope.selected.region  );

        //  Show butns now that the url is configed.
        $scope.selected.showBtns = true;
      }
    };






});


//  just for the desktops in the house
app.controller('DesktopCtrl', function ($scope, $state, $log){

  if( $scope.smellsLikeAMobileDevice() ){
    $state.go('mobile');
  };

});


//  takes the selected "### - Route Name" style name and spits out the 
var setProperRoute = function( dirty, allRoutes ){
  //  just the route number
  //  TODO: when there is no route number...
  //  TODO: when there is something like "255A" or "123B"
  var clean = parseInt(dirty), obj;

  //  Loop through the routes for that region, and pick out the one with the matching route number
  $.each( allRoutes, function(i, val){
    //  TODO: make the route numbers intergers cause for no need to parseInt them
    //      BUT WAIT: if they are ints, you gotta account for "255A", like above...
    if( parseInt(val.num) === clean ){
      obj = val;
    }
  });

  return obj;
};


//  Gets the route data and stores it in localstorage, as well as a current date stamp
var getRouteData = function($http, $scope){

  //  Lets get the route data, and y'all know we gon save it in localstorage to save time later
  $http.get('js/routes.json')
    .success(function(data, status){
        //  Regions is an array of region names, capitalized
        $scope.regions = data.regions;
        //  routes is an object which contains each of the region's associated routes
        $scope.routes = data.routes;
        var d = new Date();
        //  add a date stamp to this bitttch
        data.date = Date.parse(d);

        //  store data in localStorage
        localStorage.routesData = JSON.stringify(data);
    })
    .error(function(data, status){
        throw "Error: Could not retrieve route data from routes.json";
    });
};

//  returns the number of days since then, from now
var daysSince = function(then, now){
  return Math.floor(( now - then ) / 86400000);
};

//  Configures the url to the pdf where our sched is located at
var configSchedUrl = function( routeData, region  ){

  var ifDir = routeData.direction ? $scope.selected.direction.toLowerCase()+'/' : '';


  var url = '../public/routes/' + region.toLowerCase() + '/' + routeData.num + '/' ;

  console.log( url );

  return url;
};



//written by dave lunny in the beautiful year of 2014