angular.module('app').factory('site', function($http,appConfig){
    
        return{
            getResources: function(site_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id+'/resource',
                    method:'GET',
                    headers:{"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })
            },
            getDetails : function(site_id) {
                return $http({
                    url: appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id,
                    method: 'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })
            },
                        
        }
       
});
