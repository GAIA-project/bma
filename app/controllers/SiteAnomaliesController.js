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

    $scope.openAnomaly = function(an){
        var id=an.resourceId;
        var d = an.date;
        var source = 'anomaly'
        $location.path('page/sensor/view/'+id).search({d:d,source:source});
    }

    $scope.propertyName = 'date';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };



});