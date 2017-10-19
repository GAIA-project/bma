(function () {
    'use strict';

    angular.module('app')
    .controller('SitesController',function($scope, $rootScope, $state, $document, appConfig,$http,sites){
        
        $scope.sites = sites.getAllSites();
        console.log(sites.getAllSites());
        
        
    })
});