'use strict';
var App = angular.module('app');
App.controller('SiteSensorsController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){

        _paq.push(['setUserId', $rootScope.TheUserName]);
        _paq.push(['setDocumentTitle', "Sensors"]);
        _paq.push(['trackPageView']);

        $scope.building = {};
        $scope.view_general_resources = 0;
        
        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id);
            spark_areas.then(function(areas){

                $scope.building.areas = areas.data.sites;
                $scope.building.areas.forEach(function(area){
                    $scope.details(area);
                })
            });
        }

        $scope.editSensorName = function(sensor){
            
            sensor.editing = true;
        }

        $scope.saveSensor = function(sensor){
            sensor.editing = false;
            
            var k = Sensor.rename(sensor);
            k.then(function(t){
                _paq.push(['trackEvent', 'Sensor', 'Rename', sensor.name]);
                
            }).catch(function(e){
                $scope.error_view = 1;
                $scope.error_text +=e.statusText;               
            });
            
        }

        $scope.viewGeneralResources = function(){
            $scope.view_general_resources = 1;
        }
        $scope.hideGeneralResources = function(){
            $scope.view_general_resources = 0;
        }
        $scope.getGeneralResources = function(){

          
            $scope.error_view = 0;
            $scope.error_text = "";
            $scope.general_resources = [];
            var resources = Area.getResources($stateParams.id);
            resources.then(function(info){
               
                $scope.general_resources = info.data.resources;
                $scope.general_resources.forEach(function(sensor,index){
                        var m = Sensor.getMeasurementsByResourceId(sensor.resourceId);
                            m.then(function(datas){
                                
                                sensor.metrics = datas.data;
                                sensor.metrics.latest = parseFloat(sensor.metrics.latest).toFixed(2);
                            });                           
                    });

            }).catch(function(e){

                $scope.error_view = 1;
                $scope.error_text +="Sparkworks:"+e.data.message;
                
            });
        }
        $scope.details = function(area){
            
          
            $scope.error_view = 0;
            $scope.error_text = "";
            var resources = Area.getResources(area.id);
            resources.then(function(info){

                area.resources = info.data.resources;
                area.resources.forEach(function(sensor,index){
                        var m = Sensor.getMeasurementsByResourceId(sensor.resourceId);
                            m.then(function(datas){
                                sensor.metrics = datas.data;
                                sensor.metrics.latest = parseFloat(sensor.metrics.latest).toFixed(2);

                            });                           
                    });

            }).catch(function(e){

                $scope.error_view = 1;
                $scope.error_text +="Sparkworks:"+e.data.message;
               
            });
        }  
        
        $scope.available_observes = [];
        $scope.available_observes.push({'name':'Light','encoded_name':'Light','uom':'lux','translated_name':'LIGHT'});
        $scope.available_observes.push({'name':'Energy','encoded_name':'Energy','uom':'mWh','translated_name':'ENERGY'});
        $scope.available_observes.push({'name':'Temperature','encoded_name':'Temperature','uom':'Centigrade','translated_name':'TEMPERATURE'});
        $scope.available_observes.push({'name':'ComfortLevel','encoded_name':'comfort level','uom':'Raw','translated_name':'COMFORT_LEVEL'});
        $scope.available_observes.push({'name':'SharedResource','encoded_name':'shared resource','uom':'Raw','translated_name':'SHARED_RESOURCE'});
        $scope.virtual_sensors = [];

        $scope.save_new_virtual_sensor = function(){
            
            var obs = $scope.available_observes.filter(function(item) {
                        return item.name === $scope.new_virtual_sensor.observes;
                        })[0];
             
             
             
             var data = {
                "name":         $scope.new_virtual_sensor.name,
                "observes":     $scope.new_virtual_sensor.observes,
                "uom":          obs.uom
            };
            var req = {
                 method: 'POST',
                 url: appConfig.main.apis.main+'ps/resource',
                 headers: {
                   'Content-Type': 'application/json',"Authorization":"bearer "+appConfig.main.auth_token
                 },
                 data: data
            }
            $http(req).then(function(d){
             
                var nj = {
                    "resources":[d.data]
                };
                

             var req2 = {
                 method: 'POST',
                 url: appConfig.main.apis.main+'location/site/'+$stateParams.id+'/resource/add',
                 headers: {
                   'Content-Type': 'application/json',"Authorization":"bearer "+appConfig.main.auth_token
                 },
                 data: nj
            }
            $http(req2).then(function(d){
            
                $scope.add_a_virtual_sensor_form = 0;
                $scope.new_virtual_sensor = {};
                $scope.getPSResources();

            }, function(e){
                console.log(e);
            });

        });

}
      
       var t_site = site.getDetails($stateParams.id);
        t_site.then(function(tsite){            
            $scope.building.details = tsite.data;
        });


        $scope.getPSResources = function(){

            var senss = site.getResources($stateParams.id);
                senss.then(function(sites){        
                $scope.virtual_sensors = [];
                sites.data.resources.forEach(function(thesensor,index){
                console.log(thesensor.uri + " : " + thesensor.name);                            
                        if(thesensor.uri.startsWith("gaia-ps")){
                            $scope.virtual_sensors.push(thesensor);
                            var m = Sensor.getMeasurementsByResourceId(thesensor.resourceId);
                            m.then(function(datas){
                                thesensor.metrics = datas.data;
                                thesensor.metrics.latest = parseFloat(thesensor.metrics.latest).toFixed(2);
                            }); 
                        }                       
               
                    });

                });
        }

        



        $scope.goToSensor = function(sensor_id){
            $location.path('page/sensor/view/'+sensor_id);   
        }


        $scope.addVirtualSensor = function(){
            console.log("Virtual Sensor");
            $scope.add_a_virtual_sensor_form = 1;
            $scope.new_virtual_sensor = {};
        }
    })