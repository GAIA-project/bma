(function () {
    'use strict';


angular.module('app').run(function($rootScope, $templateCache,$translate,$log,$stateParams) {


        $rootScope.getL = function(){
        return $translate('Lang');
            var l = "";
            var x = $translate('Lang');
            x.then(function(y){
                l=y;
            });
            return x;
        }
        $rootScope.getLanguage = function(){
            var x = $rootScope.getL();
            x.then(function(oo){
                return oo;
            });
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
            console.log("THE OBJ");
            console.log(the_obj);
            console.log(the_lang);
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
                console.log("day:"+day);
                console.log("month:"+month);
                console.log("year:"+year);

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

        $rootScope.getToken = function(){
            return $stateParams.token;
        }

               


});

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            var routes, setRoutes;

            routes = [
                'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                'map/maps','page/buildings','page/building','page/alerts','page/recommendations','page/rule_engine',
                'table/static', 'table/dynamic', 'table/responsive','page/add-a-rule',
                'form/elements', 'form/layouts', 'form/validation', 'form/wizard',
                'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup',
                'app/calendar'
            ]

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'app/' + route + '.html'
                };
                $stateProvider.state(route, config);
                return $stateProvider;
            };

            routes.forEach(function(route) {
            
                    return setRoutes(route);    
                            
            });


            
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
                templateUrl: 'app/page/building_sensors_comparison.html'
            });
            $stateProvider.state('page/building/school_compare', {
                url: '/page/building/school_compare/:id',
                templateUrl: 'app/page/sites_comparison.html'
            });
             
             

            $stateProvider.state('page/building/notifications', {
                url: '/page/building/notifications/:id',
                templateUrl: 'app/page/building_notifications.html'
            });
             
            
            $stateProvider.state('page/building/topview',{
                url:'/page/building/topview/:id',
                templateUrl:'app/page/building_top_view.html'
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
                templateUrl: 'app/page/building_rules.html'
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

          

            $stateProvider.state('chart', {
                url: '/page/chart/:id/:token/:step/:from/:to',
                templateUrl: 'app/page/chart.html'
            });

        }]
    );

})(); 