angular.module('app').factory('UoM', function($http,appConfig){
    
        return{
            getUoMs:function(){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.uom,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                })
            }
        }
       
});
