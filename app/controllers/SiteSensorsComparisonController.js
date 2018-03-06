'use strict';
var App = angular.module('app');
App.controller('SiteSensorsComparisonController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,buildings,$filter){

    _paq.push(['setUserId', $rootScope.TheUserName]);
    _paq.push(['setDocumentTitle', "Multiple Sensors Comparison"]);
    _paq.push(['trackPageView']);

    $scope.selected_sensors = [];
    $scope.available_sensors = [];
    $scope.diagram3 = {};
    $scope.av_granularities = $rootScope.granularity_values;
    $scope.av_granularities[0].gran_selected = true;



    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

        console.log(list);
        $scope.selected_sensors_to_show = list;
    };
    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };



    var t_site = Area.getSiteInfo($stateParams.id);
    t_site.then(function(respo){


        if(!$rootScope.isUndefined(respo.data.json)){

            var json = JSON.parse(respo.data.json);

            if(!$rootScope.isUndefined(json.energy_consumption_resource)){
                $scope.available_sensors.push({'name':'energy','resource_id':json.energy_consumption_resource,'uom':json.energy_consumption_resource_uom});
            }
            if(!$rootScope.isUndefined(json.luminosity_resource)){
                $scope.available_sensors.push({'name':'luminosity','resource_id':json.luminosity_resource,'uom':json.luminosity_resource_uom});
            }
            if(!$rootScope.isUndefined(json.relative_humidity_resource)){
                $scope.available_sensors.push({'name':'relative_humidity','resource_id':json.relative_humidity_resource,'uom':json.relative_humidity_resource_uom});
            }
            if(!$rootScope.isUndefined(json.temperature_resource)){
                $scope.available_sensors.push({'name':'temperature','resource_id':json.temperature_resource,'uom':json.temperature_resource_uom});
            }


            if(!$rootScope.isUndefined(json) && !$rootScope.isUndefined(json.extra_charts)){

                json.extra_charts.forEach(function(chart,index){
                    $scope.available_sensors.push({'name':chart.name,'resource_id':chart.resource_id,'uom':chart.uom});
                });
            }

        }


    });


    $scope.clearChart = function(){
        // var canvas = document.getElementById('line3');
        // if (canvas){
        //     var ctx = canvas.getContext('2d');
        //     ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        // }
    }

    $scope.getChart = function(){
        $scope.clearChart();
        $scope.loading=1;

        $scope.counter = 0;
        var date_from = $scope.from_time.getTime();
        var date_to = $scope.to_time.getTime();

        var granularity  = $scope.granularity;
        var varseries = [];
        $scope.chart_times = [];
        var legends = [];
        $scope.ress = [];
        $scope.data = [];
        $scope.chart = {};
        $scope.chart.options = {};
        $scope.diagram3.options = {};
        $scope.diagram3.legend = {};
        $scope.diagram3.options.title = "";
        $scope.diagram3.options.tooltip = {trigger: 'axis'};
        $scope.diagram3.options.legend = {data:[]};
        $scope.diagram3.options.toolbox=$rootScope.toolbox;
        $scope.diagram3.options.calculable=true;

        $scope.diagram3.options.xAxis = [{
            type : 'category',
            boundaryGap : false,
            data : $scope.chart_times
        }];

        $scope.diagram3.options.yAxis =[{
            type : 'value',
            axisLabel : {
                formatter: '{value} '
            }
        }];

        $scope.diagram3.options.series = [];

        $scope.selected_sensors_to_show.forEach(function(sensor,index){
            $scope.measurementUnit = sensor.uom;
            sensor.chart = Sensor.getComparingQueryTimeRange({
                "from": date_from,
                "granularity": $scope.granularity,
                "resourceID": sensor.resource_id,
                "targetUom": sensor.uom,
                "to": date_to
            });



            sensor.chart.then(function(vals){
                var obj     = vals.data.results;
                var thevals   = obj[Object.keys(obj)[0]];
                $scope.ress.push({'sensor':sensor,'vals':thevals});
                $scope.counter++;

                if($scope.counter===($scope.selected_sensors_to_show.length)){
                    $scope.drawchart();
                }

            }).catch(function(error){
                console.log(error);
                $scope.error = "error";
                $scope.counter++;

                if($scope.counter===($scope.selected_sensors_to_show.length)){
                    $scope.drawchart();
                }
            });



        });



    }


    $scope.drawchart=  function(){
        $scope.legends = [];
        var datas = [];
        $scope.tdates = [];
        $scope.time = [];

        $scope.diagram3 = {};
        delete $scope.diagram3;
        $scope.diagram3 = {};

        $scope.diagram3.options = {};
        $scope.diagram3.options.legend = {};
        $scope.diagram3.options.series = [];
        _paq.push(['trackEvent', 'Compare', 'OurBulding', '1']);

        $scope.ress.forEach(function(res,index){


            $scope.legends.push($filter('translate')(res.sensor.name));
            var d = [];

            res.vals.data.forEach(function(dat,index){
                d.push(parseFloat(dat.reading).toFixed(2));
                var m = new Date(dat.timestamp);
                if(res.sensor.resource_id==$scope.ress[0].sensor.resource_id)
                    $scope.time.push($rootScope.convertForTimeAxis(m,$scope.granularity));
            });

            datas.push({
                name:$filter('translate')(res.sensor.name),
                type:'line',
                smooth:true,
                itemStyle:   $rootScope.getItemStyle(res.sensor.uom),
                data:d
            });

        });


        $scope.diagram3.options = {};
        $scope.diagram3.options={
            title : {
                text: "",
            },
            tooltip : {
                trigger: 'axis'
            },
            legend:{data:$scope.legends},
            toolbox:$rootScope.toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    scale : true,
                    data : $scope.time
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale : true,
                    axisLabel : {
                        formatter: '{value} '
                    }
                }
            ],
            series : datas
        };
        $scope.loading=0;
        var chart = document.getElementById('diagram3');
        var myChart = echarts.init(chart);
        myChart.setOption($scope.diagram3.options);
    }


})