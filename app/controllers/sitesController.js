'use strict';
var App = angular.module('app');
    App.controller('SitesController',function($scope, $rootScope, $state, $document, appConfig,$http,buildings,$location,site,Area,AccessToken,authentication){
        
        _paq.push(['setUserId', $rootScope.TheUserName]);
        _paq.push(['setDocumentTitle', "Buildings"]);
        _paq.push(['trackPageView']);
          $scope.abuildings = [];
        $scope.loading = 0;


                localStorage.removeItem('GAIA-controlPermission',false);
                localStorage.removeItem('GAIA-modifyPermission',false);
                localStorage.removeItem('GAIA-reusePermission',false);

        var init = function(){
            $scope.loading = 1;
            $scope.buildings = [];

            appConfig.main.selected_building = 0;

            var role = authentication.getRole();
            role.then(function(a){

                

                console.log("********   A  **********");
                console.log(a);
                if(a.data.authenticated){

                    var authorities = a.data.authorities;

                    angular.forEach(authorities,function(role,index){
                        if(role.authority.startsWith("ROLE_GAIA")){
                            appConfig.main.auth_role = role.authority;
                            appConfig.main.TheUserName = a.data.name;
                            console.log("Authority: "+appConfig.main.auth_role);
                            $location.url('/page/buildings');
                        }
                    })
                    
                }


            });



            var m = buildings.getSites();
            m.then(function(bs){
               $scope.loading = 0;
                
                bs.data.sites.forEach(function(ssite,index){
                    if(ssite.master){
                        ssite.display_name = ssite.name;
                        $scope.buildings.push(ssite);                        
                        var details = site.getDetails(ssite.id);                        
                        details.then(function(details,index){                            
                            ssite.details = details.data;                            
                            ssite.sw_name = details.data.swedishLocalizedName;
                            ssite.it_name = details.data.italianLocalizedName;
                            ssite.en_name = details.data.englishLocalizedName;
                            ssite.el_name = details.data.greekLocalizedName;
                            
                        })
                    }
                });
                $scope.changeSchoolsName($rootScope.lang);
                console.log("Language:"+$rootScope.lang);
            }).catch(function(error){
                $scope.loading = 0;
                $scope.error = 1;
                $scope.error_text = "Currently there is an error with the database connection. Please try it later";
            });
        }
        $scope.changeSchoolsName = function(lang){
            console.log("Change Scoohl Name called:"+lang);
            $scope.buildings.forEach(function(site,index){

                if(lang=='en')
                    site.display_name  = ($rootScope.isUndefined(site.en_name)?site.name:site.en_name);
                else if(lang=='el')
                    site.display_name = ($rootScope.isUndefined(site.el_name)?site.name:site.el_name);
                else if(lang=='sw')
                    site.display_name = ($rootScope.isUndefined(site.sw_name)?site.name:site.sw_name);
                else if(lang=='it')
                    site.display_name = ($rootScope.isUndefined(site.it_name)?site.name:site.it_name);
            });
        }
        var langChanged = $scope.$watch('lang', function (newValue, oldValue,$rootScope) {
            console.log(newValue);
            switch (newValue) {
                case 'en':
                    $scope.changeSchoolsName('en');
                    break; 
                case 'el':
                    $scope.changeSchoolsName('el');
                    break; 
                case 'sw':
                    $scope.changeSchoolsName('sw');
                    break; 
                case 'it':
                    $scope.changeSchoolsName('it');                    
                    break; 
                default: 
                    $scope.changeSchoolsName('el');
            }
        });

        $scope.$on('$destroy', function() {
            langChanged();
        });

      
        $scope.details = function(site){
            console.log("SITE SITE");
            console.log("SITE SITE");
            console.log("SITE SITE");
            console.log(site);

            site.sharedUsers.forEach(function(tuser){                        
                if(tuser.username==appConfig.main.TheUserName){
                    console.log(tuser);
                    console.log(tuser);
                    console.log(tuser);
                    console.log(tuser);
                    _paq.push(['trackEvent', 'Building', 'Select', site.display_name]);
                    $rootScope.selected_school_name = site.display_name;
                    appConfig.main.selected_building = site.id;
                    
                    

                    localStorage.setItem('GAIA-controlPermission',tuser.controlPermission);
                    localStorage.setItem('GAIA-modifyPermission',tuser.modifyPermission);
                    localStorage.setItem('GAIA-reusePermission',tuser.reusePermission);


                    $location.path('page/building/view/'+site.id);
                    $rootScope.connectToRuleEngine(site.id);

                }
            });

        }
       
        init();
        
    })