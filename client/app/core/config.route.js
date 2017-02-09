(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            var routes, setRoutes;

            routes = [
                'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                'map/maps','page/buildings','page/building','page/alerts','page/recommendations',
                'table/static', 'table/dynamic', 'table/responsive',
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


            $stateProvider.state('page/building/new', {
                url: '/page/building/new',
                templateUrl: 'app/page/building.html'
            });


            
            $stateProvider.state('page/building/topview',{
                url:'/page/building/topview/:id',
                templateUrl:'app/page/building_top_view.html'
            });

            $stateProvider.state('page/building/add_measurements',{
                url:'/page/building/add_measurements/:id',
                templateUrl:'app/page/building_add_measurements.html'
            })

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

            $urlRouterProvider
                .when('/', '/dashboard')

                .otherwise('/dashboard');


            $stateProvider.state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html'
            });

        }]
    );

})(); 