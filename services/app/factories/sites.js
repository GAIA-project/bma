angular.module('app').factory('buildings', function($http,appConfig){
    
        return{
            getSites:function(){
                return $http({
                    url:'https://api.sparkworks.net/v1/location/site',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })                    
            },
            getAllBuildings : function() {
                return $http({
                    url: appConfig.main.apis.over_db+appConfig.main.apis.buildings,
                    method: 'GET'
                })
            },
            getColor:function(){
            	return 'blue'; 
            }
        }
       
});
