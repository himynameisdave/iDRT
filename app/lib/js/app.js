//	Written by Dave Lunny
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

//	Not much to see here, other than the sweet redirect to desktop if needed
app.controller('Controller', function ($scope, $state, $log) {


	var init = function(){	

		//	Transport off to the desktop site if its not a mobile device
		//	to aid development, we're only checking resolutions/widths
		// if( !isMobileDevice() || smellsLikeAMobileDevice() ){
		if( !$scope.smellsLikeAMobileDevice() ){
			$state.go('desktop');
		}
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


	$(document).ready(init);
});


//	just for the mobiles in the house
//	this where the goods at
app.controller('MobileCtrl', function ($scope, $state, $log){

	
	
	
	
		
});





//	just for the desktops in the house
app.controller('DesktopCtrl', function ($scope, $state, $log){

	if( $scope.smellsLikeAMobileDevice() ){
		$state.go('mobile');
	};

});








//written by dave lunny in the beautiful year of 2014