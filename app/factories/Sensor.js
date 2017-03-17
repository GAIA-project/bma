angular.module('app').factory('Sensor', function($http,appConfig){
    
        return{
            getMeasurementsByURI:function(uri){
                return $http({
                    url:appConfig.main.apis.main+'resource/uri/'+uri,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                })
            },
            getLatest:function(resource_id){
                return $http({
                    url:appConfig.main.apis.main+'resource/'+resource_id+'/summary',
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
            getDetailsFromSparks:function(sensor_id){
                return $http({
                    url:appConfig.main.apis.main+'resource/'+sensor_id,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                })  
            },
            getMeasurementsBySearch:function(uri,id){
                if(id>10){
                        var days=40;
                        var date = new Date().getTime();
                        var last = new Date(date - (days * 24 * 60 * 60 * 1000)).getTime();

                
                    return $http({
                        url:appConfig.main.apis.main+'resource/query/timerange',
                        data:{
                            
                                "queries":[{
                                    "from":last,                                           
                                    "granularity":"day",
                                    "resourceID":id,
                                    "resultLimit":200,
                                    "to":date
                                }]
                            
                        },
                        method:'POST',
                        headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                    })
                }
                else
                    return "resource with resource_id="+id+" is in wrong database";
            },
            getMeasurementsByResourceId:function(resource_id){
            	if(resource_id>10)
	            	return $http({
	                    url:appConfig.main.apis.main+'resource/'+resource_id+'/summary',
	                    method:'GET',
	                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
	                })
            	else
            		return "resource with resource_id="+resource_id+" is in wrong database";
            }
        }
       
});
