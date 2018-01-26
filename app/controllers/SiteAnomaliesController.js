'use strict';
var App = angular.module('app');
App.controller('SiteAnomaliesController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter,theArea){

    _paq.push(['setUserId', $rootScope.TheUserName]);
    _paq.push(['setDocumentTitle', "Anomalies"]);
    _paq.push(['trackPageView']);


    $scope.getAnomalies=function(){
        var anomalies = site.getAnomalies($stateParams.id);
        anomalies.then(function(tanomalies){
            $scope.anomalies = tanomalies.data;
        });
    }

    $scope.openAnomaly = function(id){
        $location.path('page/anomaly/view/'+id);
    }



});