'use strict';
var App = angular.module('app');
App.controller('LogoutController',function($scope,$window,$location,appConfig,authentication,$rootScope,AccessToken){
         
         sessionStorage.clear();

    })