'use strict';
var App = angular.module('app');
App.controller('SiteStructureController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter,theArea){

    _paq.push(['setUserId', $rootScope.TheUserName]);
    _paq.push(['setDocumentTitle', "Areas"]);
    _paq.push(['trackPageView']);

    $scope.building = {};
    $scope.building.aggregated_power = {};
    $scope.building.rest_resources = [];
    $scope.building.resources = [];
    $scope.building.site_resources = [];

    $scope.new_virtual_sensor = {};

    $scope.available_observes = [];
    $scope.available_observes.push({'name':'Light2','encoded_name':'light2','uom':'lux2'});
    $scope.available_observes.push({'name':'Light','encoded_name':'light','uom':'lux'});

    $scope.available_types = [];
    $scope.available_types.push({'name':'BUILDING','id':'1'});
    $scope.available_types.push({'name':'FLOOR','id':'1'});
    $scope.available_types.push({'name':'ROOM','id':'1'});
    $scope.available_types.push({'name':'LAB','id':'1'});
    $scope.available_types.push({'name':'CLASSROOM','id':'1'});
    $scope.available_types.push({'name':'GYM','id':'1'});
    $scope.available_types.push({'name':'HALL','id':'1'});
    $scope.available_types.push({'name':'CORRIDOR','id':'1'});
    $scope.available_types.push({'name':'ELEVATOR','id':'1'});
    $scope.available_types.push({'name':'OTHER','id':'1'});

    $scope.translations = {};
    $scope.translations.el = {};
    $scope.translations.en = {};
    $scope.translations.sw = {};
    $scope.translations.it = {};

    $scope.translations.el.description = "Περιγραφή";
    $scope.translations.el.subareas = "Υποπεριοχές";
    $scope.translations.el.sensors = "Αισθητήρες";

    $scope.translations.en.description = "description";
    $scope.translations.en.subareas = "subareas";
    $scope.translations.en.sensors = "sensors";

    $scope.translations.it.description = "descrizione";
    $scope.translations.it.subareas = "sottoaree";
    $scope.translations.it.sensors = "sensori";



    switch ($rootScope.lang) {
        case 'en':
            $scope.language = $scope.translations.en;
            break;
        case 'el':
            $scope.language = $scope.translations.el;
            break;
        case 'sw':
            $scope.language = $scope.translations.sw;
            break;
        case 'it':
            $scope.language = $scope.translations.it;
            break;
        default:
            $scope.language = $scope.translations.el;
    }

    var langChanged = $scope.$watch('lang', function (newValue, oldValue,$rootScope) {

        switch (newValue) {
            case 'en':
                $scope.language = $scope.translations.en;
                break;
            case 'el':
                $scope.language = $scope.translations.el;
                break;
            case 'sw':
                $scope.language = $scope.translations.sw;
                break;
            case 'it':
                $scope.language = $scope.translations.it;
                break;
            default:
                $scope.language = $scope.translations.el;
        }
    });

    $scope.$on('$destroy', function() {
        langChanged();
    });
    $scope.getDaysStats = function(){
        $scope.building.aggregated_power.mondays = 0;
        $scope.building.aggregated_power.tuesdays = 0;
        $scope.building.aggregated_power.wednesday = 0;
        $scope.building.aggregated_power.thursdays =0;
        $scope.building.aggregated_power.fridays = 0;
        $scope.building.aggregated_power.saturdays = 0;
        $scope.building.aggregated_power.sundays = 0;
        $scope.bar_week_day = {};
        $scope.bar_week_day.options = {};

        var now = new Date().getTime();
        var months_before = new Date(now-12*30*24*60*60*1000).getTime();
        var mondays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","MONDAY");
        mondays.then(function(y){
            console.log("DAYS")
            console.log(y);

            if(y.data.unitOfMeasurement == 'mWh'){
                y.data.unitOfMeasurement = 'kWh';
                y.data.average = y.data.average/1000000;
            }
            $scope.building.aggregated_power.mondays = y.data;

            var tuesdays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","TUESDAY");
            tuesdays.then(function(y){
                console.log("DAYS")
                console.log(y);

                if(y.data.unitOfMeasurement == 'mWh'){
                    y.data.unitOfMeasurement = 'kWh';
                    y.data.average = y.data.average/1000000;
                }
                $scope.building.aggregated_power.tuesdays = y.data;

                var wednesday = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","WEDNESDAY");
                wednesday.then(function(y){
                    console.log("DAYS")
                    console.log(y);

                    if(y.data.unitOfMeasurement == 'mWh'){
                        y.data.unitOfMeasurement = 'kWh';
                        y.data.average = y.data.average/1000000;
                    }

                    $scope.building.aggregated_power.wednesday = y.data;

                    var thursdays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","THURSDAY");
                    thursdays.then(function(y){
                        console.log("DAYS")
                        console.log(y);

                        if(y.data.unitOfMeasurement == 'mWh'){
                            y.data.unitOfMeasurement = 'kWh';
                            y.data.average = y.data.average/1000000;
                        }

                        $scope.building.aggregated_power.thursdays = y.data;

                        var fridays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","FRIDAY");
                        fridays.then(function(y){
                            console.log("DAYS")
                            console.log(y);

                            if(y.data.unitOfMeasurement == 'mWh'){
                                y.data.unitOfMeasurement = 'kWh';
                                y.data.average = y.data.average/1000000;
                            }

                            $scope.building.aggregated_power.fridays = y.data;


                            var saturdays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","SATURDAY");
                            saturdays.then(function(y){
                                console.log("DAYS")
                                console.log(y);

                                if(y.data.unitOfMeasurement == 'mWh'){
                                    y.data.unitOfMeasurement = 'kWh';
                                    y.data.average = y.data.average/1000000;
                                }

                                $scope.building.aggregated_power.saturdays = y.data;

                                var sundays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","SUNDAY");
                                sundays.then(function(y){
                                    console.log("DAYS")
                                    console.log(y);

                                    if(y.data.unitOfMeasurement == 'mWh'){
                                        y.data.unitOfMeasurement = 'kWh';
                                        y.data.average = y.data.average/1000000;
                                    }

                                    $scope.building.aggregated_power.sundays = y.data;


                                    $scope.bar_week_day.options = {
                                        tooltip : {
                                            trigger: 'axis',
                                            axisPointer : {
                                                type : 'shadow'
                                            }
                                        },
                                        calculable : true,
                                        legend: {
                                            data:['Direct']
                                        },
                                        xAxis : [{
                                            type : 'category',
                                            data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                                        }],
                                        yAxis : [{type : 'value'}],
                                        series : [
                                            {
                                                name:'kWh',
                                                type:'bar',
                                                data:[parseFloat($scope.building.aggregated_power.mondays.average).toFixed(2),parseFloat($scope.building.aggregated_power.tuesdays.average).toFixed(2),parseFloat($scope.building.aggregated_power.wednesday.average).toFixed(2),parseFloat($scope.building.aggregated_power.thursdays.average).toFixed(2),parseFloat($scope.building.aggregated_power.fridays.average).toFixed(2),parseFloat($scope.building.aggregated_power.saturdays.average).toFixed(2),parseFloat($scope.building.aggregated_power.sundays.average).toFixed(2)]
                                            }
                                        ]
                                    };
                                });

                            })
                        })

                    })

                })

            })

        })











    }
    $scope.getDaysStats();
    $scope.getAggregatedPowerConsumption = function () {


        var now = new Date().getTime();
        var days_before = new Date(now-30*24*60*60*1000).getTime();
        var months_before = new Date(now-12*30*24*60*60*1000).getTime();
        var x = site.getAggregatedPowerConsumption($stateParams.id,days_before,now,"DAY");
        x.then(function(y){

            if(y.data.unitOfMeasurement == 'mWh'){
                y.data.unitOfMeasurement = 'kWh';
                y.data.average = y.data.average/1000000;
            }

            $scope.building.aggregated_power.daily = y.data;

        })

        var k = site.getAggregatedPowerConsumption($stateParams.id,months_before,now,"MONTH");
        k.then(function(y){

            if(y.data.unitOfMeasurement == 'mWh'){
                y.data.unitOfMeasurement = 'kWh';
                y.data.average = y.data.average/1000000;
            }

            $scope.building.aggregated_power.monthly = y.data;

        })

        var ol = site.getAggregatedPowerConsumption($stateParams.id,now,now,"DAY");
        ol.then(function(y){

            if(y.data.unitOfMeasurement == 'mWh'){
                y.data.unitOfMeasurement = 'kWh';
                y.data.average = y.data.average/1000000;
            }

            $scope.building.aggregated_power.today = y.data;

        })

        var ko = site.getAggregatedPowerConsumption($stateParams.id,now,now,"MONTH");
        ko.then(function(y){

            if(y.data.unitOfMeasurement == 'mWh'){
                y.data.unitOfMeasurement = 'kWh';
                y.data.average = y.data.average/1000000;
            }

            $scope.building.aggregated_power.this_month = y.data;

        })


    };
    $scope.getAggregatedPowerConsumption();

    var t_site = site.getDetails($stateParams.id);
    t_site.then(function(tsite){

        $scope.building.details = tsite.data;
    });


    $scope.getInitAreas = function(){
        var spark_areas = site.getSparkAreas($stateParams.id);
        spark_areas.then(function(areas){
            $scope.building.subareas = areas.data.sites;

            angular.forEach($scope.building.subareas,function(area){

                var subsite = site.getDetails(area.id);
                subsite.then(function(tsite){
                    $scope.building.details = tsite.data;
                    area.extra_info = tsite.data;
                    area.printed_name = $rootScope.getLocalizedName(area);
                });


            });
        });
    }
    $scope.getAreasResources = function(){

        var resources = Area.getResources($stateParams.id);
        resources.then(function(info){

            $scope.building.resources = info.data.resources;
            $scope.building.resources.forEach(function(sensor,index){
                if($rootScope.isUndefined(sensor.name)){
                    sensor.print_name = sensor.uri;
                }
                else{
                    sensor.print_name = sensor.name;
                }
                if(sensor.uri.startsWith('site-')){

                    $scope.building.site_resources.push(sensor);
                }else{
                    $scope.building.rest_resources.push(sensor);
                }
            });

        }).catch(function(e){

            $scope.error_view = 1;
            $scope.error_text +="Sparkworks:"+e.data.message;

        });

    }
    $scope.gotoArea = function(area){
        $location.path('page/building/structure/'+area.id);
    }
    $scope.gotoSensor = function(sensor){
        console.log(sensor);
        $location.path('page/sensor/view/'+sensor.resourceId);
    }





})