angular.module('app').factory('authentication', function($http,appConfig){
    
        return{
            authenticate : function() {
                
                return $http({
                    url: appConfig.main.apis.authentication+'?client_id=buildingmanager&client_secret=634c1f75-71d9-4362-8e7f-91b643722362&grant_type=password&username=greenmindset20&password=16A321368Ca',
                    method: 'POST',
                    headers: {}
                })
            }
        }
       
});