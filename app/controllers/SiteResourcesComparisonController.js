'use strict';
var App = angular.module('app');
App.controller('SiteResourcesComparisonController', function ($scope, $q, $rootScope, appConfig, $state, $stateParams, $timeout, site,Area, Sensor, $filter) {

    _paq.push(['setUserId', $rootScope.TheUserName]);
    _paq.push(['setDocumentTitle', "Multiple Resources Chart"]);
    _paq.push(['trackPageView']);

    $scope.available_measurements = [];
    $scope.selected_sensors = [];
    $scope.available_sensors = [];
    $scope.line3 = {};
    $scope.av_granularities = $rootScope.granularity_values;
    $scope.av_granularities[0].gran_selected = true;



    var spark_areas = site.getSparkAreas($stateParams.id);
    spark_areas.then(function(areas) {
        areas.data.sites.forEach(function(area){
            $scope.getResourcesPerArea(area);
        });
    });


    var senss = site.getResources($stateParams.id);
    senss.then(function (sites) {
        console.log("****");
        console.log(sites);
        $scope.available_measurements = sites.data.resources;
        console.log("Available Measurements");
        console.log($scope.available_measurements);
        angular.forEach(sites.data.resources, function (res, index) {

            $scope.available_sensors.push({
                value: res.name,
                name: res.name,
                uom: res.uom,
                resource_id: res.resourceId
            });
        });
    });


    $scope.getResourcesPerArea = function(area) {
        var resources = Area.getLocalResources(area.id);
        resources.then(function(info){

            area.resources = info.data.resources;
            area.resources.forEach(function(sensor,index){

                $scope.available_sensors.push({
                    value: sensor.name,
                    name: sensor.name,
                    uom: sensor.uom,
                    resource_id: sensor.resourceId
                });

            });

        }).catch(function(e){

            $scope.error_view = 1;
            $scope.error_text +="Sparkworks:"+e.data.message;

        });
    }


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


    $scope.getChart = function () {

        $scope.loading = 1;

        $scope.counter = 0;
        var date_from = $scope.from_time.getTime();
        var date_to = $scope.to_time.getTime();
        $scope.line3 = {};
        delete $scope.line3;
        $scope.line3 = {};

        $scope.chart_times = [];
        $scope.ress = [];
        $scope.data = [];
        $scope.chart = {};
        $scope.chart.options = {};
        $scope.line3.options = {};
        $scope.line3.legend = {};
        $scope.line3.options.title = "";
        $scope.line3.options.tooltip = {trigger: 'axis'};
        $scope.line3.options.legend = {data: []};
        $scope.line3.options.toolbox = $rootScope.toolbox;
        $scope.line3.options.calculable = true;

        $scope.line3.options.xAxis = [{
            type: 'category',
            boundaryGap: false,
            data: $scope.chart_times
        }];

        $scope.line3.options.yAxis = [{
            type: 'value',
            axisLabel: {
                formatter: '{value} '
            }
        }];

        $scope.line3.options.series = [];

        $scope.selected_sensors_to_show.forEach(function (sensor, index) {
            $scope.measurementUnit = sensor.uom;
            sensor.chart = Sensor.getComparingQueryTimeRange({
                "from": date_from,
                "granularity": $scope.granularity,
                "resourceID": sensor.resource_id,
                "targetUom": sensor.uom,
                "to": date_to
            });


            sensor.chart.then(function (vals) {
                var obj = vals.data.results;
                var thevals = obj[Object.keys(obj)[0]];
                $scope.ress.push({'sensor': sensor, 'vals': thevals});
                $scope.counter++;

                if ($scope.counter === ($scope.selected_sensors_to_show.length)) {
                    $scope.drawchart();
                }

            }).catch(function (error) {
                console.log(error);
                $scope.error = "error";
                $scope.counter++;

                if ($scope.counter === ($scope.selected_sensors_to_show.length)) {
                    $scope.drawchart();
                }
            });


        });


    }


    $scope.drawchart = function () {

        var datas = [];
        $scope.legends = [];
        delete $scope.legends;
        $scope.legends = [];
        $scope.tdates = [];
        $scope.time = [];


        $scope.line3.options = {};
        $scope.line3.options.legend = {};
        $scope.line3.options.series = [];
        $scope.yAxis = [];
        _paq.push(['trackEvent', 'Compare', 'MultipleResources', '1']);

        $scope.ress.forEach(function (res, index) {


            $scope.legends.push($filter('translate')(res.sensor.name));
            var d = [];

            res.vals.data.forEach(function (dat, index) {
                d.push(parseFloat(dat.reading).toFixed(2));
                var m = new Date(dat.timestamp);
                if (res.sensor.resource_id == $scope.ress[0].sensor.resource_id)
                    $scope.time.push($rootScope.convertForTimeAxis(m, $scope.granularity));
            });

            datas.push({
                name: $filter('translate')(res.sensor.name) + " (" + res.sensor.uom + ")",
                type: 'line',
                smooth: true,
                yAxisIndex: index,
                itemStyle: $rootScope.getItemStyle(res.sensor.uom),
                data: d
            });
            $scope.yAxis.push({
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: '{value} '
                }
            });
        });


        $scope.line3.options = {};
        $scope.line3.options = {
            title: {
                text: "",
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {data: $scope.legends},
            toolbox: $rootScope.toolbox,
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    scale: true,
                    data: $scope.time
                }
            ],
            yAxis: $scope.yAxis,
            series: datas
        };
        $scope.loading = 0;

        var chart = document.getElementById('diagram');
        var myChart = echarts.init(chart);
        myChart.setOption($scope.line3.options);
    }


    $scope.granularity = $scope.av_granularities[0];

});
