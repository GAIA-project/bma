'use strict';
var App = angular.module('app');
App.controller('BuildingRulesController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter,AccessToken){
        
        

        $scope.add_a_rule_form = 0;
        $scope.building = {};
        $scope.rules = [];
        $scope.error = 0;

        $scope.getInitAreas = function(){
            $scope.error = 0;
            var building = site.getCNITBuilding($stateParams.id);
                building.then(function(building){
                    var areas = site.getCNITAreas($stateParams.id);
                        areas.then(function(res){
                            $scope.building.areas = res.data;
                        },function(error){
                            $scope.error = 1;
                            $scope.error_text = error.data.message;
                        });
            },function(error){
                if(error.status==404){
                    $scope.setBuilding();
                }
            });
            
        }
        $scope.setBuilding = function(){
            $scope.error = 0;
            var set_building = site.setCNITBuilding($stateParams.id);
                set_building.then(function(areas){
                $scope.building.areas = areas.data;
            },function(error){
                    $scope.error = 1;
                    $scope.error_text = error.data.message;
            });   
        }

        $scope.getRules = function(area){
            $scope.error = 0;
            $scope.selected_area = area;
            var area_id = area.aid;
            $scope.add_a_rule_form = 0;

            var req = {
                 method: 'GET',
                 url: appConfig.main.apis.cnit+'area/'+area_id+'/rules',
                 headers: {
                   'Content-Type': 'application/json',
                   "Authorization":"bearer "+AccessToken.get().access_token
                 }
            }
            $http(req).then(function(d){
                  $scope.rulesList = d.data;
            }, function(e){
                $scope.error = 1;
                $scope.error_text = e.data.message;
            });
        }


        $scope.getSensors = function(){
            $scope.error = 0;
            var area_sensors = Area.getResources($scope.selected_area.aid);
            area_sensors.then(function(sensors){
                console.log(sensors);
                $scope.selected_area_sensors = sensors.data.resources;  
                            
            }).catch(function(error){
              console.log(error);  
                $scope.error = 1;
                $scope.error_text = "Currently there is an error with the database connection. Please try it later";
            });
        
        }

        $scope.addRule = function(){
            $scope.error = 0;
            $scope.add_a_rule_form = 1;
            $scope.getSensors();
        }


      
        $scope.deleteRule = function(rule){
            console.log(rule);
            console.log(rule.rid);
            console.log();
            var req = {
                 method: "DELETE",
                 url: appConfig.main.apis.cnit+'rules/'+rule.rid.replace('#',''),
                 headers: {
                   'Content-Type': 'application/json'
                 }
            }
            $http(req).then(function(d){
                  $scope.rule = {};
                  $scope.getRules($scope.selected_area);
                  
            }, function(e){
                $scope.error = 1;
                $scope.error_text = e.data.message;
                console.log(e);
            });
        
        }
        $scope.editRule = function(rule){
            $scope.add_a_rule_form = 1;
            $scope.getSensors();
            console.log(rule);
            $scope.rule = {};
            $scope.rule.name = rule.fields.name;
            $scope.rule.description = rule.fields.description;
            $scope.rule.operator = rule.fields.operator;
            $scope.rule.suggestion = rule.fields.suggestion;
            $scope.rule.threshold = rule.fields.threshold;
            $scope.rule.uri = rule.fields.uri;
            $scope.rule.rid = rule.rid;
            $scope.rule.edit = 1;
        }
        $scope.cancel_new_rule = function(){
            $scope.rule = {};
            $scope.add_a_rule_form=0;
        }
        $scope.save_new_rule = function(){

            if($scope.rule.edit==1){
                var method = "PUT";
                var url = appConfig.main.apis.cnit+'rules/'+$scope.rule.rid.replace('#','');
                _paq.push(['trackEvent', 'RuleEngine', 'Edit Rule', 'Rule id:'+$scope.rule.rid]); 
            }
            else{
                var url = appConfig.main.apis.cnit+'area/'+$scope.selected_area.aid+'/rules';
                var method = "POST";
                _paq.push(['trackEvent', 'RuleEngine', 'Add Rule', 'Area:'+$stateParams.id]); 
            }

            var data = {
                "class":"SimpleThresholdRule",
                "fields":{
                    "name":             $scope.rule.name,
                    "description":      $scope.rule.description,
                    "operator":         $scope.rule.operator,
                    "suggestion":       $scope.rule.suggestion,
                    "threshold":        $scope.rule.threshold,
                    "uri":              $scope.rule.uri
                }
            };

            var req = {
                 method: method,
                 url: url,
                 headers: {
                   'Content-Type': 'application/json'
                 },
                 data:data
            }
            $http(req).then(function(d){
                  $scope.rule = {};
                  $scope.getRules($scope.selected_area);
                  
            }, function(e){
                $scope.error = 1;
                $scope.error_text = e.data.message;

            });
        }



    })