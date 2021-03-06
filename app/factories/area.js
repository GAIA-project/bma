angular.module('app').factory('Area', function($http,appConfig,AccessToken){
    
        return{
            
            createSiteInfo:function(area){
                console.log(area);
                return $http({
                    url:appConfig.main.apis.over_url+'/gaia-building-knowledge-base/sites/'+area.id+'/siteInfo',
                    method:'POST',
                    headers: {"Accept": "application/hal+json","Authorization":AccessToken.get().access_token},
                    data:{
                      "cardinalDirection": null,
                      "coolingSystem": null,
                      "country": null,
                      "cubicMeters": null,
                      "dateOfConstruction": null,
                      "englishLocalizedDescription": null,
                      "englishLocalizedName": null,
                      "exposure": null,
                      "greekLocalizedDescription": null,
                      "greekLocalizedName": null,
                      "heatingSystem": null,
                      "italianLocalizedDescription": null,
                      "italianLocalizedName": null,
                      "json": null,
                      "maximumNumberOfPeople": null,
                      "siteId": null,
                      "siteInfoId": null,
                      "sourcesOfEnergy": null,
                      "squareMeters": null,
                      "swedishLocalizedDescription": null,
                      "swedishLocalizedName": null,
                      "type": null
                    }
                })
            },
            updateSiteInfo:function(area_id,tdata){
                
                return $http({
                    url:appConfig.main.apis.over_url+'/gaia-building-knowledge-base/siteInfo/'+area_id,
                    method:'PUT',
                    headers: {"Accept": "application/hal+json","Authorization":AccessToken.get().access_token},
                    data:tdata
                })
            },
            updateSiteInfoSparkworks:function(area_id,tdata){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+area_id,
                    method:'POST',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token},
                    data:tdata
                })
                
            },
            getSiteInfo:function(site_id){
                console.log("Get Site Info:"+site_id);
                return $http({
                    url:appConfig.main.apis.over_url+'/gaia-building-knowledge-base/sites/'+site_id+'/siteInfo',
                    method:'GET',
                    headers: {"Accept": "application/hal+json","Authorization":AccessToken.get().access_token}
                })
            },
            getDetails : function(area_id) {
                return $http({
                    url: appConfig.main.apis.over_db+appConfig.main.apis.area+area_id,
                    method: 'GET'
                })
            },
            getResources:function(area_id){
                 return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+area_id+'/resource',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
                })
            },
            getLocalResources:function(area_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+area_id+'/resources/localonly',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+AccessToken.get().access_token}
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
