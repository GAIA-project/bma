angular.module('app').factory('sites', function($http,appConfig){
    
        return{
            getAllSites : function() {
                return $http({
                    url: appConfig.main.apis.main+appConfig.main.apis.sites,
                    method: 'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })
            },
            getColor:function(){
            	return 'blue'; 
            }
        }
       
});
