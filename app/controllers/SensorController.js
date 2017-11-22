'use strict';
var App = angular.module('app');
App.controller('SensorController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,UoM,AccessToken){
        
        $scope.sensor_measurements = {};
        $scope.dates_one = [];
        $scope.available_uoms = [];

        $scope.sensor = {
            id:$stateParams.id
        };
      

      $scope.initLoaded = function(){
        
        $(".date_time").flatpickr({
            enableTime: true,
            enableSeconds:true
        });
      }

        var chart_details = Sensor.getDetailsFromSparks($scope.sensor.id);
            chart_details.then(function(chartdetails){
             
                $scope.t_sensor = chartdetails.data;
                $scope.t_sensor.name = ($rootScope.isUndefined($scope.t_sensor.name)?$scope.t_sensor.uri:$scope.t_sensor.name);

                $scope.measurementUnit = chartdetails.data.uom;
                $scope.available_uoms.push(chartdetails.data.uom);
                $scope.selected_uom = chartdetails.data.uom;
                $scope.selected_granularity = 'day';
                var available_uom = UoM.getAvailableTargets(chartdetails.data.uom);
                available_uom.then(function(av_uoms){
                    var avi = av_uoms.data.unitConversions;
                    avi.forEach(function(uom){
                        $scope.available_uoms.push(uom.target);
                    })
                });
                        

        var meas = Sensor.getMeasurementsByResourceId($scope.sensor.id);
        meas.then(function(measurements){
                
                if(measurements.data.keyName.startsWith("gaia-ps")){
                    $scope.add_measurements_btn_view = true;
                }
                
                
                $scope.second_period_to_time = new Date(measurements.data.latestTime);
                $scope.first_period_from_time = new Date($scope.second_period_to_time-47*24*60*60*1000);
                $scope.update();                

                $scope.sensor.meatrics = measurements.data;                  
                var the_data = measurements.data.day;                             
               
            }); 
         });

            
        $scope.open_new_measurements = function(){
            $scope.new_measurements_form = 1;
            $scope.virtual = {};
            var x = new Date();
            $scope.virtual.time = x.getFullYear()+"-"+parseInt(x.getMonth()+1)+"-"+x.getDate()+" "+x.getHours()+":"+x.getMinutes()+":"+x.getSeconds();
        }
        

        

        $scope.save_value_virtual = function(){
            console.log($scope.virtual.time);

            var data = [];
            data.push({
                "resourceId": $scope.sensor.id,
                "time": new Date($scope.virtual.time).getTime(),
                "value": $scope.virtual.value
            });
            var x = {data:data};


            var req = {
                 method: 'POST',
                 url: appConfig.main.apis.main+'ps/data',
                 headers: {
                   'Content-Type': 'application/json',"Authorization":"bearer "+AccessToken.get().access_token
                 },
                 data: x
            }
            $http(req).then(function(d){
              
                _paq.push(['trackEvent', 'VirtualSensor', $scope.sensor.id, $scope.virtual.value]);
                $scope.new_measurements_form = 0;
                $scope.virtual = {};
                $scope.afterPSPost();
            }).catch(function(error){
                    
                    
                }); 
            

        }

        $scope.cancel_virtual_value = function(){
            $scope.virtual = {};
            $scope.new_measurements_form = false;
        }

        $scope.afterPSPost = function(){
            
            $scope.loading = 1;
            
            $scope.obj = {};
            $scope.obj.one = {};
            $scope.obj.one.from = $rootScope.convertToMiliseconds($scope.first_period_from_time);
            $scope.obj.one.to = $rootScope.convertToMiliseconds(new Date());
            $scope.obj.one.resourceID= $scope.sensor.id;
            $scope.obj.one.granularity = $scope.selected_granularity;
            $scope.obj.one.targetUom = $scope.selected_uom;
            
            var first = Sensor.getComparingQueryTimeRange($scope.obj.one);
              first.then(function(vals){
                
                var obj     = vals.data.results;
                var vals1   = obj[Object.keys(obj)[0]];
                    vals1 = vals1.data;

                var vals    = [];
                $scope.vals1 = [];
                
                $scope.tdates   = [];             

                vals1.forEach(function(val,index){                            
                    $scope.vals1.push($rootScope.addCommas(parseFloat(val.reading).toFixed(2)));
                    var m = new Date(val.timestamp);                        
                    $scope.tdates.push($rootScope.convertForTimeAxis(m,$scope.obj.one.granularity));
                });
                $scope.setChartValues();
                $scope.loading = 0;

            });


        }

        $scope.update = function(){
            
            $scope.loading = 1;
            
            $scope.obj = {};
            $scope.obj.one = {};
            $scope.obj.one.from = $rootScope.convertToMiliseconds($scope.first_period_from_time);
            $scope.obj.one.to = $rootScope.convertToMiliseconds($scope.second_period_to_time)+((1000*60*60*24)-2000);
            $scope.obj.one.resourceID= $scope.sensor.id;
            $scope.obj.one.granularity = $scope.selected_granularity;
            $scope.obj.one.targetUom = $scope.selected_uom;
            $scope.measurementUnit      = $scope.selected_uom;

            var first = Sensor.getComparingQueryTimeRange($scope.obj.one);
              first.then(function(vals){
                
                var obj     = vals.data.results;
                var vals1   = obj[Object.keys(obj)[0]];
                    

                $scope.average = $rootScope.addCommas(parseFloat(vals1.average).toFixed(2))+" "+$scope.selected_uom;
                $scope.summary = $rootScope.addCommas(parseFloat(vals1.summary).toFixed(2))+" "+$scope.selected_uom;
                vals1 = vals1.data;

                var vals    = [];
                $scope.vals1 = [];                
                $scope.tdates   = [];             

                vals1.forEach(function(val,index){                            
                    $scope.vals1.push(parseFloat(val.reading).toFixed(2));
                    var m = new Date(val.timestamp);                        
                    $scope.tdates.push($rootScope.convertForTimeAxis(m,$scope.obj.one.granularity));
                    //console.log(val.timestamp+":"+val.reading+":"+$rootScope.addCommas(parseFloat(val.reading).toFixed(2)));
                });
                $scope.setChartValues();
                $scope.loading = 0;

            });


        }



        $scope.setChartValues = function(){

                    $scope.sensor_measurements.options = {
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter : function (params) {
                            
                            return params[0].name+'<br/>'+$rootScope.addCommas(params[0].value)+ ' '+$scope.measurementUnit
                        }
                    },

                    legend: {
                        data:['Mesurements']
                    },
                    toolbox:{show : true,
            feature : {
                restore : {show: true, title: "Restore"},
                saveAsImage : {show: true, title: "Save as image"},
                dataZoom : {show: true,title:{zoom:"Zoom",back:"Reset Zoom"}},
                dataView : {show: true,title:"DataView",lang: ['Data View', 'Close', 'Refresh']},
                magicType : {show: true, type: ['line', 'bar'],title:{
                    line: 'Line',
                    bar: 'Bar',
                    force: 'Force',
                    chord: 'Chord',
                    pie: 'Pie',
                    funnel: 'Funnel'
                }},
            }},
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : $scope.tdates
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'Measurements',
                            type:'line',
                            smooth:true,
                            itemStyle: $rootScope.itemStyle,
                            data:$scope.vals1
                        }
                    ]
                    };
                }


        
        
     


    })