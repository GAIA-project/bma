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
    $scope.av_granularities = $rootScope.granularity_values;
    $scope.av_granularities[0].gran_selected = true;

    $scope.bar_week_day_visible = true;
    $scope.energy_consumption_per_sq_meter_visible = true;

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

    $scope.calculate = function(){

        var site_id = $stateParams.id;
        var from = new Date($scope.from_time).getTime();
        var to   = new Date($scope.to_time).getTime();
        var granularity = $scope.granularity;

        $scope.analytics = {};

        $scope.analytics.energy_consumption_sq_meter_loading = true;
        var x = site.getEnergyConsumptionPerSQMeter(site_id,from,to,granularity);
        x.then(function(data) {
            $scope.analytics.energy_consumption_sq_meter_loading = false;
            $scope.analytics.energy_consumption_sq_meter = parseFloat(data.data.average).toFixed(2);
            $scope.analytics.energy_consumption_sq_meter_uom = data.data.unitOfMeasurement;
            if(data.data.unitOfMeasurement=='mWh/m^2'){
                $scope.analytics.energy_consumption_sq_meter = parseFloat(data.data.average).toFixed(2)/1000000;
                $scope.analytics.energy_consumption_sq_meter_uom = 'kWh/m^2';
            }
        },function(error){
            $scope.analytics.energy_consumption_sq_meter_loading = false;
            $scope.analytics.energy_consumption_sq_meter = error.data.message;
        });


        $scope.analytics.energy_consumption_cubic_meter_loading = true;
        var y = site.getEnergyConsumptionPerCubicMeter(site_id,from,to,granularity);
        y.then(function(data) {
            $scope.analytics.energy_consumption_cubic_meter_loading = false;
            $scope.analytics.energy_consumption_cubic_meter = parseFloat(data.data.average).toFixed(2);
            $scope.analytics.energy_consumption_cubic_meter_uom = data.data.unitOfMeasurement;
            if(data.data.unitOfMeasurement=='mWh/m^3'){
                $scope.analytics.energy_consumption_cubic_meter = parseFloat(data.data.average).toFixed(2)/1000000;
                $scope.analytics.energy_consumption_cubic_meter_uom = 'kWh/m^3';
            }
        },function(error){
            $scope.analytics.energy_consumption_cubic_meter_loading = false;
            $scope.analytics.energy_consumption_cubic_meter = error.data.message;
        });



        $scope.analytics.load_peak_loading = true;
        var t = site.getStatistics(site_id,from,to,granularity,'Calculated Power Consumption');
        t.then(function(data) {

            $scope.analytics.load_peak_loading = false;
            $scope.analytics.load_peak = parseFloat(data.data.maximum).toFixed(2);
            $scope.analytics.load_peak_uom = data.data.unitOfMeasurement;
            if(data.data.unitOfMeasurement=='mWh'){
                $scope.analytics.load_peak = parseFloat(data.data.maximum).toFixed(2)/1000000;
                $scope.analytics.load_peak_uom = 'kWh';

            }

            $scope.analytics.co2_emmitions = parseFloat($scope.analytics.load_peak*0.514).toFixed(2);
            $scope.analytics.co2_emmitions_uom = 'Kg CO2/m^2';
            $scope.co2_emmitions_text = "Assuming that 1kWh is 0.514 Kg of CO2";
            console.log("CO2");
            console.log(data);
            //manos
            data.data.measurements.forEach(function(meas,ind){
                if(meas.reading==data.data.maximum){
                    $scope.analytics.load_peak_when = new Date(meas.timestamp);
                }

            })

        },function(error){
            $scope.analytics.load_peak_loading = false;
            $scope.analytics.load_peak = error.data.message;
        });





        $scope.analytics.minimum_indoor_temperature_loading = true;
        var t = site.getStatistics(site_id,from,to,granularity,'Temperature');
        t.then(function(data) {

            $scope.analytics.minimum_indoor_temperature_loading = false;
            $scope.analytics.minimum_indoor_temperature = parseFloat(data.data.minimum).toFixed(2);
            $scope.analytics.minimum_indoor_temperature_uom = data.data.unitOfMeasurement;

            $scope.analytics.maximum_indoor_temperature_loading = false;
            $scope.analytics.maximum_indoor_temperature = parseFloat(data.data.maximum).toFixed(2);
            $scope.analytics.maximum_indoor_temperature_uom = data.data.unitOfMeasurement;

        },function(error){
            $scope.analytics.minimum_indoor_temperature_loading = false;
            $scope.analytics.minimum_indoor_temperature = error.data.message;

            $scope.analytics.maximum_indoor_temperature_loading = false;
            $scope.analytics.maximum_indoor_temperature = error.data.message;
        });




        $scope.analytics.visual_comfort_loading = true;
        var t = site.getStatistics(site_id,from,to,granularity,'Light');
        t.then(function(data) {

            $scope.analytics.visual_comfort_loading = false;
            $scope.analytics.visual_comfort = parseFloat(data.data.average).toFixed(2);
            $scope.analytics.visual_comfort_uom = data.data.unitOfMeasurement;


        },function(error){
            $scope.analytics.visual_comfort_loading = false;
            $scope.analytics.visual_comfort = error.data.message;
        });




        $scope.analytics.indoor_humidity_loading = true;
        var t = site.getStatistics(site_id,from,to,granularity,'Relative Humidity');
        t.then(function(data) {

            $scope.analytics.indoor_humidity_loading = false;
            $scope.analytics.indoor_humidity = parseFloat(data.data.average).toFixed(2);
            $scope.analytics.indoor_humidity_uom = data.data.unitOfMeasurement;


        },function(error){
            $scope.analytics.indoor_humidity_loading = false;
            $scope.analytics.indoor_humidity = error.data.message;
        });





        $scope.analytics.aural_comfort_loading = true;
        var t = site.getStatistics(site_id,from,to,granularity,'Noise');
        t.then(function(data) {

            $scope.analytics.aural_comfort_loading = false;
            $scope.analytics.aural_comfort = parseFloat(data.data.average).toFixed(2);
            $scope.analytics.aural_comfort_uom = data.data.unitOfMeasurement;


        },function(error){
            $scope.analytics.aural_comfort_loading = false;
            $scope.analytics.aural_comfort = error.data.message;
        });




    }

    $scope.getEnergyConsumptionPerSQMeter = function(site_id,from,to,granularity){

        $scope.energy_consumption_per_sq_meter = {};
        $scope.energy_consumption_per_sq_meter_chart = {};
        $scope.energy_consumption_per_sq_meter_loading_visible = 1;
        $scope.energy_consumption_per_sq_meter.unitOfMeasurement = 'kWh/m^2';

       var x = site.getEnergyConsumptionPerSQMeter(site_id,from,to,granularity);
       x.then(function(data){
           $scope.energy_consumption_per_sq_meter_loading_visible = 0;

           $scope.energy_consumption_per_sq_meter = data.data;
           $scope.energy_consumption_per_sq_meter.average =$scope.energy_consumption_per_sq_meter.average/1000000;
           $scope.energy_consumption_per_sq_meter.maximum =$scope.energy_consumption_per_sq_meter.maximum/1000000;
           $scope.energy_consumption_per_sq_meter.unitOfMeasurement = 'kWh/m^2';

           var months = [];
           var data = [];
           $scope.energy_consumption_per_sq_meter.measurements.forEach(function(meas,inde){
               months.push(new Date(meas.timestamp));
               data.push(parseFloat(meas.reading/1000000).toFixed(2));
           });

           $scope.energy_consumption_per_sq_meter_chart.options = {
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
                   data : months
               }],
               yAxis : [{type : 'value'}],
               series : [
                   {
                       name:$scope.energy_consumption_per_sq_meter.unitOfMeasurement,
                       type:'bar',
                       data:data,
                       itemStyle: {
                           normal: {
                               color: '#c2862d',
                               shadowBlur: 70,
                               shadowColor: 'rgba(0, 0, 0, 0.5)'
                           }
                       }
                   }
               ]
           };



       },function(error){
           $scope.energy_consumption_per_sq_meter_loading_visible = 0;
           $scope.energy_consumption_per_sq_meter_error_visible = 1;
           $scope.energy_consumption_per_sq_meter_error = error.data.message;
           $scope.energy_consumption_per_sq_meter_visible = 0;
       })
    }
    $scope.getEnergyConsumptionPerCubicMeter = function(site_id,from,to,granularity){
        $scope.energy_consumption_for_cubic = {};
        $scope.energy_consumption_for_cubic_loading_visible = 1;
        var x = site.getEnergyConsumptionPerCubicMeter(site_id,from,to,granularity);
        x.then(function(data){
            $scope.energy_consumption_cubic_meter = data.data;
            $scope.energy_consumption_for_cubic_loading_visible = 0;
            $scope.energy_consumption_cubic_meter.unitOfMeasurement = 'kWh/m^3';
            $scope.energy_consumption_cubic_meter.average =$scope.energy_consumption_cubic_meter.average/1000000;
            $scope.energy_consumption_cubic_meter.maximum =$scope.energy_consumption_cubic_meter.maximum/1000000;

            var months = [];
            var data = [];
            $scope.energy_consumption_cubic_meter.measurements.forEach(function(meas,inde){
                months.push(new Date(meas.timestamp));
                data.push(parseFloat(meas.reading/1000000).toFixed(2));
            });

            $scope.energy_consumption_for_cubic.options = {
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
                    data : months
                }],
                yAxis : [{type : 'value'}],
                series : [
                    {
                        name:$scope.energy_consumption_cubic_meter.unitOfMeasurement,
                        type:'bar',
                        data:data,
                        itemStyle: {
                            normal: {
                                color: '#c2862d',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };



        },function(error){

            $scope.energy_consumption_for_cubic_error_visible = 1;
            $scope.energy_consumption_for_cubic_error = error.data.message;
            $scope.energy_consumption_for_cubic_loading_visible = 0;
        })
    }


    var now = new Date().getTime();
    var months_before = new Date(now-12*30*24*60*60*1000).getTime();
    $scope.getEnergyConsumptionPerSQMeter($stateParams.id,months_before,now,"MONTH");
    $scope.getEnergyConsumptionPerCubicMeter($stateParams.id,months_before,now,"MONTH");


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

            if(y.data.unitOfMeasurement == 'mWh'){
                y.data.unitOfMeasurement = 'kWh';
                y.data.average = y.data.average/1000000;
            }
            $scope.building.aggregated_power.mondays = y.data;

            var tuesdays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","TUESDAY");
            tuesdays.then(function(y){


                if(y.data.unitOfMeasurement == 'mWh'){
                    y.data.unitOfMeasurement = 'kWh';
                    y.data.average = y.data.average/1000000;
                }
                $scope.building.aggregated_power.tuesdays = y.data;

                var wednesday = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","WEDNESDAY");
                wednesday.then(function(y){


                    if(y.data.unitOfMeasurement == 'mWh'){
                        y.data.unitOfMeasurement = 'kWh';
                        y.data.average = y.data.average/1000000;
                    }

                    $scope.building.aggregated_power.wednesday = y.data;

                    var thursdays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","THURSDAY");
                    thursdays.then(function(y){


                        if(y.data.unitOfMeasurement == 'mWh'){
                            y.data.unitOfMeasurement = 'kWh';
                            y.data.average = y.data.average/1000000;
                        }

                        $scope.building.aggregated_power.thursdays = y.data;

                        var fridays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","FRIDAY");
                        fridays.then(function(y){


                            if(y.data.unitOfMeasurement == 'mWh'){
                                y.data.unitOfMeasurement = 'kWh';
                                y.data.average = y.data.average/1000000;
                            }

                            $scope.building.aggregated_power.fridays = y.data;


                            var saturdays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","SATURDAY");
                            saturdays.then(function(y){


                                if(y.data.unitOfMeasurement == 'mWh'){
                                    y.data.unitOfMeasurement = 'kWh';
                                    y.data.average = y.data.average/1000000;
                                }

                                $scope.building.aggregated_power.saturdays = y.data;

                                var sundays = site.getAggregatedPowerConsumptionDAYS($stateParams.id,months_before,now,"DAY","SUNDAY");
                                sundays.then(function(y){


                                    if(y.data.unitOfMeasurement == 'mWh'){
                                        y.data.unitOfMeasurement = 'kWh';
                                        y.data.average = y.data.average/1000000;
                                    }

                                    $scope.building.aggregated_power.sundays = y.data;

                                    $scope.bar_week_day_visible = false;
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
                                                itemStyle: {
                                                    normal: {
                                                        color: '#c27e3f',
                                                        shadowBlur: 200,
                                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                    }
                                                },
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
            console.log("Spark Areas for "+$stateParams.id);
            console.log(areas);
            $scope.building.subareas = areas.data.sites;

            angular.forEach($scope.building.subareas,function(area){

                var subsite = site.getDetails(area.id);
                subsite.then(function(tsite){
                    console.log("T SITE FOUND");
                    console.log(tsite);
                    $scope.building.details = tsite.data;
                    area.extra_info = tsite.data;
                    area.printed_name = $rootScope.getLocalizedName(area);
                }).catch(function(response) {

                    $scope.building.details = area.data;
                    area.extra_info = area.data;
                    area.printed_name = area.name;
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

        $location.path('page/sensor/view/'+sensor.resourceId);
    }





})