angular.module('app').factory('Sensor', function($http,appConfig){
    
        return{
            getMeasurementsByURI:function(uri){
                return $http({
                    url:appConfig.main.apis.main+'resource/uri/sapienza/ortopedia/665qn/apcon/1',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                })
            },
            getDetails:function(sensor_id){
            	 return $http({
                    url:appConfig.main.apis.over_db+'utility/sensors/getbyid/'+sensor_id,
                    method:'GET',
                })
            },
            getMeasurementsByResourceId:function(resource_id){
            	if(resource_id>10)
	            	return $http({
	                    url:appConfig.main.apis.main+'/resource/'+resource_id+'/summary',
	                    method:'GET',
	                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
	                })
            	else
            		return "resource with resource_id="+resource_id+" is in wrong database";
            }
        }
       
});
