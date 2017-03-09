angular.module('app').factory('Sensor', function($http,appConfig){
    
        return{
            getMeasurementsByURI:function(uri){
                return $http({
                    url:appConfig.main.apis.main+'resource/uri/sapienza/ortopedia/665qn/apcon/1',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                })
            },
                        
        }
       
});
