angular.module('app').factory('site', function($http,appConfig,AccessToken){
    
        return{
            getAnomalies:function (site_id) {
                return $http({
                    url:'https://analytics.gaia-project.eu/gaia-analytics/anomalies/sites/'+site_id,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":AccessToken.get().access_token}
                })
            },
            getSparkDetails:function(site_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            getAllSites:function(){
                 return $http({
                    url:appConfig.main.apis.main+'gaia/site',
                    method:'GET'                    
                })
            },
            getAreas:function(site_id){
                return $http({
                    url:appConfig.main.apis.over_db+appConfig.main.apis.areasByBuilding+'/'+site_id,
                    method:'GET'
                })
            },
            getSparkAreas:function(site_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id+'/subsite',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            getNotificationsCNIT:function(site_id,from,to,limit){
                return $http({
                    url:appConfig.main.apis.cnit+'building/'+site_id+'/events',
                    params:{'from':from,
                        'to':to,
                        'limit':limit},
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            setCNITBuilding:function(site_id){
                return $http({
                    url:appConfig.main.apis.cnit+'building/'+site_id,
                    method:'PUT',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            getCNITBuilding:function(site_id){
                return $http({
                    url:appConfig.main.apis.cnit+'building/'+site_id,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            getCNITAreas:function(site_id){
                return $http({
                    url:appConfig.main.apis.cnit+'building/'+site_id+'/areas',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            getGateways:function(site_id){
                return $http({
                    url:appConfig.main.apis.over_db+appConfig.main.apis.gatewaysByBuilding+site_id,
                    method:'GET'
                })
            },
            getSap:function(){
                return $http({
                    url:'https://api.sparkworks.net/v1/resource',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            getResources: function(site_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id+'/resource',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}                    
                })
            },
            getDetails : function(site_id) {

         /*       url:'http://150.140.5.64:8080/gaia-building-knowledge-base/sites/'+site_id+'/siteInfo',
                    method:'GET',
                    headers: {"Accept": "application/hal+json","Authorization":AccessToken.get().access_token}
                    */
                return $http({
                    url: appConfig.main.apis.over_url+'/gaia-building-knowledge-base/sites/'+site_id+"/siteInfo",
                    method: 'GET',
                    headers: {"Accept": "application/hal+json","Authorization":AccessToken.get().access_token}
                })
            },
            syncCNIT:function(site_id){
              return $http({
                    url: appConfig.main.apis.cnit+'building/'+site_id,
                    method: 'PUT',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })  
            },
            getRules:function(site_id){
                return $http({
                    url: appConfig.main.apis.cnit+'building/'+site_id+'/events',
                    method: 'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })    
            }                        
        }
       
});
