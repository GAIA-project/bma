angular.module('app').factory('Anomaly', function($http,appConfig){
    
        return{
            getAnomalies:function(area_id,from,to){
                return $http({
                    url: appConfig.main.apis.over_db+appConfig.main.apis.getAnomalies+'/'+area_id+'/'+from+'/'+to,
                    method:'GET'
                })                    
            }
        }
       
});
