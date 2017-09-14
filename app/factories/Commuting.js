angular.module('app').factory('Commuting', function($http,appConfig){
    
        return{
            save:function(commuting){
                return $http({                    
                    url:'https://buildings.gaia-project.eu/gaia-building-knowledge-base/sites/'+commuting.site_id+'/commutings',
                    method:'POST',
                    data:{
                      "distanceInMeters": commuting.distance,
                      "meansOfTransport": commuting.mean,
                      "username": appConfig.main.TheUserName
                    },
                    headers: {"Accept": "hal+json","Authorization":"Bearer "+appConfig.main.auth_token},
                })
            }
        }
       
});
