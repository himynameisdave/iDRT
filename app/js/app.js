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

    //  Prepping
    $scope.regions = [];
    $scope.routes = {};
    $scope.routesList = [];
    $scope.currentRoutes = [];
    $scope.selected = {};

    //  Lets get route data plz
    $http.get('js/routes.json')
      .success(function(data, status){
          $scope.regions = data.regions;
          $scope.routes = data.routes;
      })
      .error(function(data, status){
          throw "Error: Could not retrieve route data from routes.json";
      });

    //  This is what populates the activeRoutes
    $scope.$watch( 'selected.region', function(){
        if( $scope.selected.region != undefined ){

          var selReg = $scope.selected.region.toLowerCase();
          $scope.currentRoutes = $scope.routes[selReg];

          //  to reset the routes list
          $scope.routesList = [];
          //  loop through each route that matches that region
          $.each( $scope.routes[selReg], function(i, val){
              $scope.routesList.push(val.num + ' - ' + val.name);
          });

        }//end if there is a selected region
    });

    $scope.$watch( 'selected.route', function(){
        if( $scope.selected.route != undefined ){

          //  at this point we're determining the date
            //  TODO move this up, as it will be done only once when the app loads
            //  perhaps not because we need to know if the current day is even possible
          $scope.daysList = setDatesList( $scope.currentRoutes, $scope.selected.route );


        }
    });

});


//  just for the desktops in the house
app.controller('DesktopCtrl', function ($scope, $state, $log){

  if( $scope.smellsLikeAMobileDevice() ){
    $state.go('mobile');
  };

});


var setDatesList = function( routes, selected ) {
  var days = [];

  $.each( routes, function(i, val){
    //  TODO: make route numbers intergers so that you dont have to parse int
    if( parseInt(val.num) === parseInt(selected)  ){

          // check what days it has available

          //  also a good time to check if we need to throw the directional flag to grab that input

    }
  });

  return days;
};




//written by dave lunny in the beautiful year of 2014