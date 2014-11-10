//	Written by Dave Lunny
var app = angular.module('app', ['ui.router']);


app.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

	$stateProvider
	    .state('home', {
	      url: "/",
	      templateUrl: "partials/view.html",
	      controller: "Controller"
	    })
});


app.controller('Controller', function ($scope) {

	

});