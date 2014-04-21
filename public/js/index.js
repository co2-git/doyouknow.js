$(document).foundation();

var ngModule = angular.module('doyouknow.js', ['ngRoute']);

ngModule.factory({
  Socket: require('./services/socket'),
  Flash: require('./services/flash')
});

ngModule.directive({
  contenteditable: require('./directives/contenteditable'),
  dykAsk: require('./directives/ask')
});

ngModule.config([
	'$routeProvider',

  '$locationProvider',
  
  function (  $routeProvider,     $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider

      .when('/install', {
        template: 'Installing what?'
      });

    $routeProvider
      .otherwise({
        template: '<dyk-ask></dyk-ask>'
      });
  }]);

ngModule.run(function ($rootScope) {
  
});