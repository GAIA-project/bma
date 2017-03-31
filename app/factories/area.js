angular.module('app').factory('Area', function($http,appConfig){
    
        return{
            getDetails : function(area_id) {
                return $http({
                    url: appConfig.main.apis.over_db+appConfig.main.apis.area+area_id,
                    method: 'GET'
                })
            },
            getSensors : function(area_id) {
                return $http({
                    url: appConfig.main.apis.over_db+appConfig.main.apis.sensorsByArea+area_id,
                    method: 'GET'
                })
            },
            delete:function(area_id){
                return $http({
                    url: appConfig.main.apis.over_db+'utility/areas/'+area_id,
                    method:'DELETE'
                }) 
            }
                        
        }
       
});
