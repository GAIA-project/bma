angular.module('app').factory('theArea', function($http,appConfig,AccessToken,$rootScope,Area){

    return{

        getName:function(area){
            var deferred = $q.defer();
            console.log(area);
            console.log(appConfig);
            var k = Area.getSiteInfo(area.id);
            var name = "";
            k.then(function(info){
                area.greekLocalizedName     = (!$rootScope.isUndefined(info.data.greekLocalizedName)?info.data.greekLocalizedName:area.name);
                area.italianLocalizedName   = (!$rootScope.isUndefined(info.data.italianLocalizedName)?info.data.italianLocalizedName:area.name);
                area.swedishLocalizedName   = (!$rootScope.isUndefined(info.data.swedishLocalizedName)?info.data.swedishLocalizedName:area.name);
                area.englishLocalizedName   = (!$rootScope.isUndefined(info.data.englishLocalizedName)?info.data.englishLocalizedName:area.name);
                if($rootScope.lang=='el')
                    name = area.greekLocalizedName;
                else if ($rootScope.lang=='sw')
                    name = area.englishLocalizedName;
                else if ($rootScope.lang=='it')
                    name = area.italianLocalizedName;
                else
                    name = area.englishLocalizedName;
                deferred.resolve(name);

            },function(){
                deferred.reject('Greeting ' + name + ' is not allowed.');
            },function(){
                return deferred.promise;
            });

        }

    }

});
