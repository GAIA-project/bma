angular.module('app').factory('UoM', function($http,appConfig){
    
        return{
            getUoMs:function(){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.uom,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                })
            },
            getAvailableTargets:function(source){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.uom+'/query',
                    method:'POST',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                    data:{"source":source}
                })
            },
            getSource:function(current){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.uom+'/query',
                    method:'POST',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                    data:{'target':current}
                })
            }
        }
       
});
