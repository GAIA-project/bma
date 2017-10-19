angular.module('app').factory('Sensor', function($http,appConfig){
    
        return{
            getAvailableUoM:function(resource_uom){
                return $http({
                    url:appConfig.main.apis.main+'uom/source/'+resource_uom,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                })
            },
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
            delete:function(sensor_id){
                return $http({
                    url:appConfig.main.apis.over_db+'utility/sensors/'+sensor_id,
                    method:'DELETE',
                })
            },
            getListOfRules:function(sensor_id){

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
                            "queries": [
                                    {
                                      "from": 1182139200,
                                      "granularity": "5min",
                                      "resourceID": 141675,
                                      "to": 1466222400
                                    }
                            ]},
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
            },
            getMeasurementsByResourceIdAndUOM:function(resource_id,uom){
                if(resource_id>10)
                    return $http({
                        url:appConfig.main.apis.main+'resource/'+resource_id+'/summary/'+uom,
                        method:'GET',
                        headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                    })
                else
                    return "resource with resource_id="+resource_id+" is in wrong database";
            },
            getComparingQueryTimeRange:function(object){
                return $http({
                        url:appConfig.main.apis.main+'resource/query/timerange',
                        method:'POST',
                        data:{
                            "queries": [object]
                        },
                        headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                    })
            },
            getComparingQueryTimeRangeBulk:function(queries){
                return $http({
                        url:appConfig.main.apis.main+'resource/query/timerange',
                        method:'POST',
                        data:{
                            "queries": queries
                        },
                        headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token},
                    })
            }
        }
       
});
