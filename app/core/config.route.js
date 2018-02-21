(function () {
    'use strict';

angular.module('app').run(function($rootScope, $templateCache,$translate,$log,appConfig,$filter,$state,$location) {
 
        $rootScope.actions = [];
        $rootScope.actions.push({'name':'edit_building','permission':['ROLE_GAIA_LOCAL_MANAGER','ROLE_GAIA_GLOBAL_MANAGER','ROLE_GAIA_ADMIN','ROLE_GAIA_TEACHER']});
        $rootScope.actions.push({'name':'edit_area','permission':['ROLE_GAIA_LOCAL_MANAGER','ROLE_GAIA_GLOBAL_MANAGER','ROLE_GAIA_ADMIN','ROLE_GAIA_TEACHER']});
        $rootScope.actions.push({'name':'addVirtualSensor','permission':['ROLE_GAIA_LOCAL_MANAGER','ROLE_GAIA_GLOBAL_MANAGER','ROLE_GAIA_ADMIN','ROLE_GAIA_TEACHER']});
        $rootScope.actions.push({'name':'edit_sensor_name','permission':['ROLE_GAIA_LOCAL_MANAGER','ROLE_GAIA_GLOBAL_MANAGER','ROLE_GAIA_ADMIN']});
        $rootScope.actions.push({'name':'edit_rule_engine','permission':['ROLE_GAIA_ADMIN','ROLE_GAIA_GLOBAL_MANAGER','ROLE_GAIA_LOCAL_MANAGER']});


    $rootScope.getLocalizedName = function(area){
        console.log("Localized Name for");
        console.log(area);
        var name = area.extra_info.englishLocalizedName;
        var clang= $rootScope.getLanguage();

        if(clang=='Greek')
            name = area.extra_info.greekLocalizedName;
        else if (clang=='Swidian')
            name = area.extra_info.englishLocalizedName;
        else if (clang=='Italy')
            name = area.extra_info.italianLocalizedName;
        else
            name = area.extra_info.englishLocalizedName;

        if($rootScope.isUndefined(name))
            name = area.name;

        return name;

    }


        $rootScope.hasPermission = function(action){

            if(localStorage.getItem('GAIA-'+action)){

                if(localStorage.getItem('GAIA-'+action)=='false')
                    return false
                else 
                    return true;
            }else
                return false;

        }


        
        $rootScope.getL = function(){
        return $translate('Lang');

        }









        
        $rootScope.granularity_values = [];
        $rootScope.granularity_values.push({'text':'5min','name':'per_5min'});
        $rootScope.granularity_values.push({'text':'hour','name':'per_hour'});
        $rootScope.granularity_values.push({'text':'day','name':'per_day'});
        $rootScope.granularity_values.push({'text':'month','name':'per_month'});

        $rootScope.saved = function(){
            
            $('.saved').show();
            $('.saved').delay(3000).fadeOut('slow');
        }

        $rootScope.compare_strings = [];
        $rootScope.compare_strings.push({
                'id':1,
                'name':'temperature',
                'gr':'Θερμοκρασία',
                'it':'Temp',
                'en':'Temperature'            
        });

        $rootScope.compare_strings.push({
                'id':2,
                'name':'luminosity',
                'gr':'Φωτεινότητα',
                'it':'luminosity',
                'en':'Luminosity'            
        });

        $rootScope.compare_strings.push({
                'id':3,
                'name':'relative_humidity',
                'gr':'Υγρασία',
                'it':'relative_humidity',
                'en':'Ρelative Ηumidity'            
        });

        $rootScope.compare_strings.push({
                'id':4,
                'name':'energy',
                'gr':'Κατανάλωση Ενέργειας',
                'it':'energy',
                'en':'energy'            
        });
                
        
        $rootScope.getTranslatedName = function(the_obj,the_lang){
            return the_obj.data.greekLocalizedName;
        }

        $rootScope.isUndefined = function(val){

            if(angular.isUndefined(val) || val === null || val==null || val=="null" || val === " " || val === "")
                return true;
            else
                return false;                    
       }

        
        
        $rootScope.convertToMiliseconds = function(tdat){
                tdat = new Date(tdat);
                var day = tdat.getDate();
                var month = tdat.getMonth();                
                var year = tdat.getFullYear();
               
                var utcDate = new Date(Date.UTC(year,month,day));
                var starttime = new Date(utcDate.getFullYear(),utcDate.getMonth(),utcDate.getDate())/1;
                
                return starttime;
        }


        $rootScope.convertForTimeAxis = function(timest,granularity){
            
            var m = timest;
            switch(granularity) {
                case '5min':
                    return m.getHours()+":"+m.getMinutes()+":00";
                break;
                case '5mins':
                    return m.getHours()+":"+m.getMinutes()+":00";
                break; 
                case 'hour':                                        
                    return m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00";
                break; 
                case 'day':
                    return m.getDate()+"/"+parseInt(m.getMonth()+1)+"/"+m.getUTCFullYear();
                break; 
                case 'month':                                           
                    return $rootScope.convertToTextMonth(parseInt(m.getMonth())+1)+" "+m.getUTCFullYear();
                break; 
                default:                                            
                    return m;
            }
        }

        $rootScope.addCommas = function(n){
            
            var rx=  /(\d+)(\d{3})/;
            return String(n).replace(/^\d+/, function(w){
                while(rx.test(w)){
                    w= w.replace(rx, '$1,$2');
                }
                return w;
            });
        }

        $rootScope.$on('$viewContentLoaded', function() {
    
           
            /*console.log("TOKEN:"+appConfig.main.auth_token);
            if(appConfig.main.debug==false){
            
                if(appConfig.main.auth_token=='none' || $rootScope.isUndefined(appConfig.main.auth_token)){
                    $state.go('page/signin');
                }
            }*/

        });

});

    angular.module('app')
        .config(['$locationProvider','$stateProvider', '$urlRouterProvider','$routeProvider', function($locationProvider,$stateProvider, $urlRouterProvider,$routeProvider) {
            
            var routes, setRoutes;
            
      

            routes = [
                'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                'map/maps','page/buildings','page/building','page/alerts','page/recommendations','page/rule_engine',
                'table/static', 'table/dynamic', 'table/responsive','page/add-a-rule',
                'form/elements', 'form/layouts', 'form/validation', 'form/wizard',
                'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup',
                'app/calendar','page/logout'
            ]

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'app/' + route + '.html?v=1'
                };
                $stateProvider.state(route, config);
                return $stateProvider;
            };

            routes.forEach(function(route) {

                return setRoutes(route);                            
            });


            $stateProvider.state('page/transportation', {
                url: '/page/transportation/:id',
                templateUrl: 'app/page/transportation.html'
            });
            // $stateProvider.state('page/area/rules', {
            //     url: '/page/area/rules/:id',
            //     templateUrl: 'app/page/area_rules.html'
            // });

            $stateProvider.state('page/anomaly/view', {
                url: '/page/anomaly/view/:id',
                templateUrl: 'app/page/anomaly.html'
            });
            
            $stateProvider.state('page/building/new', {
                url: '/page/building/new',
                templateUrl: 'app/page/building.html'
            });
            $stateProvider.state('page/building/area', {
                url: '/page/building/areas/:id',
                templateUrl: 'app/page/building_areas.html'
            });
            $stateProvider.state('page/building/comparison', {
                url: '/page/building/comparison/:id',
                templateUrl: 'app/page/building_comparison.html'
            });
            $stateProvider.state('page/building/school_sensors', {
                url: '/page/building/school_sensors/:id',
                templateUrl: 'app/page/SiteSensorsComparison.html'
            });
            $stateProvider.state('page/building/school_compare', {
                url: '/page/building/school_compare/:id',
                templateUrl: 'app/page/sites_comparison.html'
            });
            $stateProvider.state('page/building/multiple_resources', {
                url: '/page/building/multiple_resources/:id',
                templateUrl: 'app/page/comparison/multiple_resources.html'
            });

            $stateProvider.state('page/help', {
                url: '/page/help',
                templateUrl: 'app/page/help.html'
            });

            $stateProvider.state('page/building/notifications', {
                url: '/page/building/notifications/:id',
                templateUrl: 'app/page/building_notifications.html'
            });
             
            
            $stateProvider.state('page/building/topview',{
                url:'/page/building/topview/:id',
                templateUrl:'app/page/building_top_view.html'
            });
            $stateProvider.state('page/building/structure',{
                url:'/page/building/structure/:id',
                templateUrl:'app/page/site/structure.html'
            });

             $stateProvider.state('page/building/anomalies',{
                url:'/page/building/anomalies/:id',
                templateUrl:'app/page/building_anomalies.html'
            });

            $stateProvider.state('page/building/add_measurements',{
                url:'/page/building/add_measurements/:id',
                templateUrl:'app/page/building_add_measurements.html'
            });
            $stateProvider.state('page/building/rules', {
                url: '/page/building/rules/:id',
                templateUrl: 'app/page/site/rules.html'
            });

            $stateProvider.state('page/building/view', {
                url: '/page/building/view/:id',
                templateUrl: 'app/page/building_view.html'
            });
            $stateProvider.state('page/building/sensors', {
                url: '/page/building/sensors/:id',
                templateUrl: 'app/page/building_sensors.html'
            });
            
            $stateProvider.state('page/building/edit/:id', {
                url: '/page/building/edit/:id',
                templateUrl: 'app/page/building.html'
            });

            $stateProvider.state('page/sensor/view', {
                url: '/page/sensor/view/:id',
                templateUrl: 'app/page/sensor_view.html'
            });



            $stateProvider.state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html'
            });

            $stateProvider.state('access_token',{
                url:'/access_token=:access_token',
                controller:function($location, AccessToken) {
                    var hash = $location.path().substr(1);
                    AccessToken.setTokenFromString(hash);
                    $location.path('/page/buildings');
                    $location.replace();
                  }
            })

           /* $routeProvider
                .when('/access_token=:accessToken', {
                  template: '',
                  controller: function ($location, AccessToken) {
                    var hash = $location.path().substr(1);
                    AccessToken.setTokenFromString(hash);
                    alert(0);
                    $location.path('/');
                    $location.replace();
                  }
            });*/



           /* console.log($routeProvider);
            $routeProvider
                .when('/access_token=:accessToken', {
                  template: '',
                  controller: function ($location, AccessToken) {
                    var hash = $location.path().substr(1);
                    AccessToken.setTokenFromString(hash);
                    alert(0);
                    $location.path('/');
                    $location.replace();
                  }
            });
                 $routeProvider
    .when("/", { templateUrl: "app/page/buildings.html", controller: "SitesController" })
    .when("/Dashboard", { templateUrl: "DashboardForm/dfTemplate.html", controller: "dfController" })
    .when("/Analysis",  { templateUrl: "AnalysisForm/afTemplate.html", controller: "afController" })
    .otherwise({ redirectTo: "/Reporting" })*/
            
                     


           

        }]
    );

})(); 