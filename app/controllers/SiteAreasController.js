'use strict';
var App = angular.module('app');
App.controller('SiteAreasController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter,theArea){
        
        _paq.push(['setUserId', $rootScope.TheUserName]);
        _paq.push(['setDocumentTitle', "Areas"]);
        _paq.push(['trackPageView']);

        $scope.building = {};
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
            console.log(newValue);
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




        var t_site = site.getDetails($stateParams.id);
        t_site.then(function(tsite){            
            $scope.building.details = tsite.data;
        });



        
        $scope.editSensorName = function(sensor){

            sensor.editing = true;
        }

        $scope.saveSensor = function(sensor){
            sensor.editing = false;
            console.log("SAVED");
            console.log(sensor);
            var k = Sensor.rename(sensor);
            k.then(function(t){
                _paq.push(['trackEvent', 'Sensor', 'Rename', sensor.name]);
                console.log(t);
            }).catch(function(e){
                $scope.error_view = 1;
                $scope.error_text +=e.statusText;               
            });
            
        }


        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id);
            spark_areas.then(function(areas){
                $scope.building.areas = areas.data.sites;

                angular.forEach($scope.building.areas,function(area){
                    //console.log(area);
                    var x = theArea.getName(area);
                    console.log("XXXXXXXX");
                    console.log(x);
                    // x.then(function(ret){
                    //     area.name = ret;
                    // })
                    //console.log ("Area Name is: "+);



                });
            });
        }

       $scope.createSiteInfo = function(area){

            var k = Area.createSiteInfo(area);
                k.then(function(info){
                    console.log(info);
                }).catch(function(e){
                    console.log(e);
                    $scope.error_view = 1;
                    $scope.error_text +=e.statusText;

                });
       }

        $scope.details = function(area){

            console.log(area);
            $scope.selected_area_view = 1;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 0;
            $scope.error_view = 0;
            $scope.error_text = "";
            $scope.selected_area = area;
            
            var resources = Area.getResources(area.id);
            resources.then(function(info){

                $scope.selected_area.resources = info.data.resources;
                $scope.selected_area.subareas = info.data.subsites;
                $scope.selected_area.name = area.name;

            }).catch(function(e){

                $scope.error_view = 1;
                $scope.error_text +="Sparkworks:"+e.data.message;
                console.log(e);
            });

            var k = Area.getSiteInfo(area.id);
            k.then(function(info){
                console.log("Info***");
                console.log(info);

                $scope.selected_area.greekLocalizedName     = (!$rootScope.isUndefined(info.data.greekLocalizedName)?info.data.greekLocalizedName:$scope.selected_area.name);
                $scope.selected_area.italianLocalizedName   = (!$rootScope.isUndefined(info.data.italianLocalizedName)?info.data.italianLocalizedName:$scope.selected_area.name);
                $scope.selected_area.swedishLocalizedName   = (!$rootScope.isUndefined(info.data.swedishLocalizedName)?info.data.swedishLocalizedName:$scope.selected_area.name);
                $scope.selected_area.englishLocalizedName   = (!$rootScope.isUndefined(info.data.englishLocalizedName)?info.data.englishLocalizedName:$scope.selected_area.name);

                $scope.selected_area_view=1;
                $scope.selected_area.siteInfoId = info.data.siteInfoId;
                $scope.selected_area.overObj = info.data;

                var tjson = JSON.parse(info.data.json);

                $scope.selected_area.description    = (!$rootScope.isUndefined(tjson)?tjson.description:'');
                $scope.selected_area.type           = (!$rootScope.isUndefined(info.data.type)?info.data.type:'');
                $scope.selected_area.width          = (!$rootScope.isUndefined(tjson)?tjson.width:'');
                $scope.selected_area.length         = (!$rootScope.isUndefined(tjson)?tjson.length:'');
                $scope.selected_area.height         = (!$rootScope.isUndefined(tjson)?tjson.height:'');

            }).catch(function(e){
                console.log(e);
                if(e.status==404){
                    $scope.createSiteInfo(area);
                }else if(e.status==500){
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.statusText;
                }
            });

        }

    
   
        $scope.updateArea = function(){
            console.log($scope.selected_area);
            $scope.selected_area.overObj.json=JSON.stringify({width:$scope.selected_area.width,height:$scope.selected_area.height,length:$scope.selected_area.length,description:$scope.selected_area.description});
            $scope.selected_area.overObj.type = $scope.selected_area.type;

            $scope.selected_area.overObj.greekLocalizedName = $scope.selected_area.greekLocalizedName;
            $scope.selected_area.overObj.englishLocalizedName = $scope.selected_area.englishLocalizedName;
            $scope.selected_area.overObj.italianLocalizedName = $scope.selected_area.italianLocalizedName;
            $scope.selected_area.overObj.swedishLocalizedName = $scope.selected_area.swedishLocalizedName;
            
            var k = Area.updateSiteInfo($scope.selected_area.siteInfoId,$scope.selected_area.overObj);
            k.then(function(a){
                _paq.push(['trackEvent', 'Area', 'Update', $scope.selected_area.id]);
                $rootScope.saved();
                $scope.details($scope.selected_area);

            }).catch(function(err){
                $scope.error_view =true;
                $scope.error_text = err.statusText;
            });
        }

        
        $scope.edit = function(){
            $scope.selected_area_view = 0;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 1;
            
        }
        $scope.add_an_area = function(){
            $scope.new_area = {};
            $scope.selected_area_view = 0;
            $scope.add_an_area_form = 1;  
            $scope.selected_area_edit = 0;
        }
        $scope.cancel_edit_area = function(){
            $scope.selected_area_view = 1;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 0;
           $scope.details($scope.selected_area);
        }
        $scope.cancel_new_area = function(){
            
            $scope.selected_area_view = 0;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 1;
        }
       

        $scope.update = function(){

            var data = {"json":JSON.stringify({width:$scope.selected_area.width,height:$scope.selected_area.height,length:$scope.selected_area.length}),"building_id":$stateParams.id,"name":$scope.selected_area.name,"description":$scope.selected_area.description,"type":$scope.selected_area.type,"id":$scope.selected_area.id};

            var req = {
                 method: 'PUT',
                 url: appConfig.main.apis.over_db+appConfig.main.apis.areas,
                 headers: {
                   'Content-Type': 'application/json'
                 },
                 data: data
            }

            $http(req).then(function(d){
                    
                    $scope.selected_area = d.data.area;
                    $scope.getInitAreas();
                    $scope.details($scope.selected_area.id);

            }, function(e){console.log(e)});
        }

      
        
        

    
    })