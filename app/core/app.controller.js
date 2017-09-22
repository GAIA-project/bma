(function () {
    'use strict';
    var App = angular.module('app');
    App.controller('RuleCtrl',function($scope,$state){
     

        $scope.rules = [];
        $scope.sensors = ('sensor1 sensor2 sensor3 sensor4 sensor5').split(' ').map(function(state) {
            return {name: state};
        });


            $scope.verbs = ('> < =').split(' ').map(function(state) {
                return {verbname: state};
            })


            $scope.add_condition = function(){
                $scope.rules.push({name:'',sensor:''});
            }
            
            if($scope.rules.length==0)
                $scope.add_condition();



           

    })
    .controller('RuleEngineCtrl',function($scope,$state){
        $scope.add_a_rule = function(){
            $state.go('page/add-a-rule');
        }

      
    })
    .controller('RecommendationsCtrl',function($scope){
        $scope.recommendations = [];
        $scope.recommendations.push({title:'Turn-off the light', content:'Turn-off the light when leaving'});
        $scope.recommendations.push({title:'Natural Light',      content:'Make the most of the natural light'});
        $scope.recommendations.push({title:'Thermostat',         content:'Change the thermostat settings in rooms to 26°C during warmer months and 20°C during cooler months. Doing so will rationalise the heating and air conditioning use'});
        $scope.recommendations.push({title:'Doors',              content:'keep your classroom doors closed whenever possible.'});
        
    })
    .controller('ClassInstanceCtrl',function($scope, $uibModalInstance){
        $scope.sensors = [];
       
       $scope.sensors.push({uri:'site-141587/Atmospheric Pressure',resourceId:'144991',name:'Temperature Sensor'});
       $scope.sensors.push({uri:'site-141587/External Ammonia Concentration',resourceId:'146628',name:'Ammonia Concentration'});
       $scope.sensors.push({uri:'libelium-00066650456e/hum',resourceId:'144119',name:'Humidity Sensor'});
       $scope.sensors.push({uri:'libelium-00066650456e/co',resourceId:'144122',name:'CO Sensor'});
       $scope.sensors.push({uri:'Power Consumption',resourceId:'144123',name:'Power Consumption Sensor'});
       $scope.sensors.push({uri:'Radiation',resourceId:'144124',name:'Radiation Sensor'});

        $scope.ok = function() {
            $uibModalInstance.close($scope.new_class); 
            $scope.$parent.$broadcast('new_class_created', $scope.new_class);           
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    })
    .controller('AlertCtrl',function($scope, $mdDialog){

        $scope.alerts = [
            { name: 'The Light in ClassRoom 5 is switched on',     newMessage: true,id:1 },
            { name: 'The Temperature sensor is not sending measurements',       newMessage: false,id:2 },
            { name: 'It is too hot in classroom 4',     newMessage: false,id:3 }
        ];        
        $scope.goToAlert = function(person, event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Navigating')
                    .content('Inspect ' + person)
                    .ariaLabel('Person inspect demo')
                    .ok('Ok!')
                    .targetEvent(event)
            );
        };
        $scope.navigateTo = function(to, event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Navigating')
                    .content('Imagine being taken to ' + to)
                    .ariaLabel('Navigation demo')
                    .ok('Ok!')
                    .targetEvent(event)
            );
        };
        $scope.doSecondaryAction = function(event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Secondary Action')
                    .content('Secondary actions can be used for one click actions')
                    .ariaLabel('Secondary click demo')
                    .ok('Neat!')
                    .targetEvent(event)
            );
        };
    })
    .controller('authCtrl',function($scope,$window,$location,appConfig,authentication){
        
        appConfig.main.auth_token = '';
        $scope.user = {};
        /**/

        $scope.authenticate= function(){
            $scope.login_error = 0;
            if($scope.user.username!='' && $scope.user.password!=''){
                appConfig.main.TheUserName = $scope.user.username;
                appConfig.main.username = $scope.user.username;
                appConfig.main.password = $scope.user.password;
                var auth  = authentication.authenticate();
                
                auth.then(function(auth) {
                    console.log(auth.data);
                    console.log(auth.data.access_token);
                    appConfig.main.auth_token = auth.data.access_token;                
                    var role = authentication.getRole();
                    role.then(function(a){

                        if(a.data.authenticated){
                            appConfig.main.auth_role = a.data.authorities[0].authority;
                            console.log("Authority: "+appConfig.main.auth_role);
                            $location.url('/page/buildings');
                        }
                    });
                    

                }, function(err) {
                    $scope.login_error = 1;
                }); 



            }else{
                    $location.path('page/signin');

            }


        }
        
        $scope.login = function() {
            $location.url('/')
        }

        $scope.signup = function() {
            $location.url('/')
        }

        $scope.reset =    function() {
            $location.url('/')
        }

        $scope.unlock =    function() {
            $location.url('/')
        } 
    })
    .controller('BuildingRulesController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter){
        
        

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
                   'Content-Type': 'application/json'
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
            }
            else{
                var url = appConfig.main.apis.cnit+'area/'+$scope.selected_area.aid+'/rules';
                var method = "POST";
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
    .controller('SitesController',function($scope, $rootScope, $state, $document, appConfig,$http,buildings,$location,site,Area){
        
          
        $scope.loading = 0;
        var init = function(){
            $scope.loading = 1;

            appConfig.main.selected_building = 0;
            var x = buildings.getAllBuildings();
            var m = buildings.getSites();
            m.then(function(bs){
               $scope.loading = 0;
                $scope.abuildings = [];
                bs.data.sites.forEach(function(ssite,index){
                    if(ssite.master){                    
                        $scope.abuildings.push(ssite);
                    }
                });
            }).catch(function(error){
                $scope.loading = 0;
                $scope.error = 1;
                $scope.error_text = "Currently there is an error with the database connection. Please try it later";
            });
        }

        $scope.details = function(id){
            appConfig.main.selected_building = id;
            $rootScope.connectToRuleEngine(id);
            $location.path('page/building/view/'+id);
        }
        
        $scope.add_new = function(){
            $state.go('page/building/new');
        }
        init();
        
    })
    .controller('AnomaliesController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Anomaly){
        

        $scope.getAnomalies=function(){
            var anomalies = Anomaly.getAnomalies($stateParams.id,1489442400000,1489142400000);
            anomalies.then(function(tanomalies){
                console.log('The Anomalies');
                console.log(tanomalies);    
            });
            
        }
        $scope.openAnomaly = function(id){
            
  
            $location.path('page/anomaly/view/'+id);   
        }
        var t_site = site.getDetails($stateParams.id);
        t_site.then(function(site){
           $scope.site = site.data; 
           
        });


    })
    .controller('AnomalyCtrl',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log){
        $scope.goToAnomalies = function(){
            $location.path('page/building/anomalies/141587');   
        }


        $scope.atags = [];
        $scope.atags.push({"id":1,"value":"tag1"});
        $scope.atags.push({"id":2,"value":"tag2"});
        $scope.atags.push({"id":3,"value":"tag3"});
        $scope.atags.push({"id":4,"value":"tag4"});
        
        $scope.addTag = function(){
            var a = {};
            a.id = $scope.atags.length+1;
            a.value = $scope.new_tag;
            $scope.atags.push(a);
            $scope.new_tag = "";
            
        }
        $scope.line3 = {};
        $scope.line3.options = {
            title : {
                text: 'Energy Consumption',
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['kWh']
            },
            toolbox: $rootScope.toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['9:50','9:51','9:52','9:53','9:54','9:55','9:56','9:57','9:58','9:59','10:00','10:01','10:02','10:03','10:04','10:05','10:06']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'kWh',
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[10, 11, 12, 54, 12,10.5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
                },
              
            ]
        };
        

    })
    
    .controller('AreaRulesController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter){
        
        
        $scope.add_the_rule = function(){
            console.log('Add the rule');

            //$scope.selected_area = $stateParams.id;
            $scope.selected_area = '143456';

         /*   if($scope.rule.edit==1){
                var method = "PUT";
                var url = appConfig.main.apis.cnit+'rules/'+$scope.rule.rid.replace('#','');
            }
            else{*/
                var url = appConfig.main.apis.cnit+'area/'+$scope.selected_area+'/rules';
                var method = "POST";
            /*}*/
            /*$scope.fields = {
                    "name":             $scope.rule.name,
                    "description":      $scope.rule.description,
                    "operator":         $scope.rule.operator,
                    "suggestion":       $scope.rule.suggestion,
                    "threshold":        $scope.rule.threshold,
                    "uri":              $scope.rule.uri
                };*/
                $scope.fields = {
                    "name":             "Manos Test",
                    "description":      "Manos description",
                    "operator":         ">",
                    "suggestion":       "E kane etsi",
                    "threshold":        "20",
                    "uri":              "site-143456/Noise"
                };
            var data = {
                "class":"SimpleThresholdRule",
                "fields":$scope.fields
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
                    console.log(d);
                  $scope.rule = {};
                  /*$scope.getRules($scope.sel_area);*/
                  
            }, function(e){
                console.log(e);
            });
        }
        //here


    })
    .controller('SiteAreasController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter){
        
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
            console.log(sensor);
            sensor.editing = true;
        }

        $scope.saveSensor = function(sensor){
            sensor.editing = false;
            console.log("SAVED");
            console.log(sensor);
            var k = Sensor.rename(sensor);
            k.then(function(t){
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
            
            var k = Area.updateSiteInfo($scope.selected_area.siteInfoId,$scope.selected_area.overObj);
            k.then(function(a){
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
    .controller('SiteEditController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Sensor,UoM,Area){
        



        $scope.add_a_chart_visible_form = 0;
        $scope.new_chart = {};
        $scope.extra_charts = [];       
        $scope.school = {};
        $scope.error_view=false;
        $scope.error_text="";
        $scope.jjson = {};


        $scope.translations = {};
        $scope.translations.el = {};
        $scope.translations.en = {};
        $scope.translations.sw = {};
        $scope.translations.it = {};

        $scope.translations.el.general_characteristic = "Γενικά Χαρακτηριστικά";
        $scope.translations.el.construction_characteristics = "Κατασκευαστικά Χαρακτηριστικά";
        $scope.translations.el.resources = "Γραφήματα & Αισθητήρες";
        $scope.translations.el.psiksi = "Σύστημα Ψύξης";
        $scope.translations.el.thermansi = "Σύστημα Θέρμανσης";

        $scope.translations.en.general_characteristic = "Genelar Characteristics";
        $scope.translations.en.construction_characteristics = "Construction Characteristics";
        $scope.translations.en.resources = "Resources";
        $scope.translations.en.psiksi = "Cooling System";
        $scope.translations.en.thermansi = "Heating System";

        $scope.translations.it.general_characteristic = "Caratteristica Generale";
        $scope.translations.it.construction_characteristics = "Caratteristiche Costruttive";
        $scope.translations.it.resources = "Risorse";
        $scope.translations.it.psiksi = "Sistema di raffreddamento";
        $scope.translations.it.thermansi = "Sistema di riscaldamento";

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


        $scope.available_uom = [];


        $scope.getAvailableUoM = function(){
            
            var m = UoM.getUoMs();
            m.then(function(datas){
                console.log(datas);
                $scope.available_uom = datas.data.unitConversions;
                $scope.available_uom.push({'target':''});

            });   
        }

             

        $scope.getUOMForExtraResource = function(ch){
            console.log(ch);

            var deta = Sensor.getDetailsFromSparks(ch.resource_id);
                deta.then(function(det){
                    console.log(det);
                    ch.default_uom = det.data.uom;
                    ch.default_uom = ch.default_uom;
                    var x = UoM.getAvailableTargets(ch.default_uom);
                    x.then(function(results){
                        console.log(results);
                        ch.available_uoms = results.data.unitConversions;
                        ch.available_uoms.push({'target':det.data.uom});
                        
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })
        }



          $scope.getUOMForResource = function(resource,where){
            console.log(resource);
            console.log(where);
            
            if(where=="energy"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log("DET");
                    console.log(det);
                    $scope.jjson.energy_consumption_resource_default_uom = det.data.uom;
                    console.log($scope.jjson.energy_consumption_resource_default_uom);
                    console.log("DET UOM: "+det.data.uom);


                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        console.log(results);
                        $scope.available_energy_uoms = results.data.unitConversions;
                        $scope.available_energy_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }


             if(where=="temperature"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log(det);
                    $scope.jjson.temperature_resource_uom = det.data.uom;
                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        $scope.temperature_resource_uoms = results.data.unitConversions;
                        $scope.temperature_resource_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }


            if(where=="luminosity"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log(det);
                    $scope.jjson.luminosity_resource_uom = det.data.uom;
                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        $scope.available_luminosity_uoms = results.data.unitConversions;
                        $scope.available_luminosity_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }


            if(where=="relative_humidity"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log(det);
                    $scope.jjson.relative_humidity_resource_uom = det.data.uom;
                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        $scope.available_relative_humidity_uoms = results.data.unitConversions;
                        $scope.available_relative_humidity_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }

        }
        $scope.getResources = function(){ 

            var available_resources = site.getResources($stateParams.id);
                available_resources.then(function(resources,index){
                    $scope.available_resources = [];
                    resources.data.resources.forEach(function(tresource){                        
                        console.log(tresource);
                        $scope.available_resources.push({id:tresource.resourceId,uri:tresource.uri,name:($rootScope.isUndefined(tresource.name)?"":"("+tresource.name+")")});
                    });
                });
        }
        
        $scope.getSparkDetails = function(){
            $scope.loading = 1;
            var t_site = site.getSparkDetails($stateParams.id);
            t_site.then(function(site) {
                $scope.sparkworks_details = site.data;
            }).catch(function(e){
                $scope.loading = 0;
                $scope.error_view=true;
                $scope.error_text = e.statusText;
            });
        }
        $scope.getSparkDetails();
        $scope.createSiteInfo = function(area){
            $scope.loading = 1;
        
                    var area = {
                        "id":$scope.site_id,
                        "greekLocalizedName": $scope.sparkworks_details.name,
                        "italianLocalizedName": $scope.sparkworks_details.name,
                        "swedishLocalizedName": $scope.sparkworks_details.name,
                        "englishLocalizedName": $scope.sparkworks_details.name
                    };
        
        var k = Area.createSiteInfo(area);
            k.then(function(info){
                $scope.getInfo();
                $scope.loading = 0;
            }).catch(function(e){
                console.log(e);
                $scope.loading = 0;
                $scope.error_view = 1;
                $scope.error_text +=e.statusText;
               
            });


       }

        $scope.getInfo = function(){
            $scope.loading = 1;
            $scope.site_id = $stateParams.id;

            var k = Area.getSiteInfo($scope.site_id);
            k.then(function(info){
                $scope.loading = 0;
                console.log("Info");
                console.log(info);
                $scope.info = info.data;

                
                
                if($rootScope.isUndefined(info.data.json))
                    $scope.school.json = {};
                else
                    $scope.school.json = JSON.parse(info.data.json);

                $scope.jjson = $scope.school.json;
                if(!$rootScope.isUndefined($scope.jjson)){
                    console.log("JJJSON");
                    console.log($scope.jjson);
                    if(!$rootScope.isUndefined($scope.jjson.energy_consumption_resource)){
                        $scope.getUOMForResource($scope.jjson.energy_consumption_resource,"energy");
                    }
                    if(!$rootScope.isUndefined($scope.jjson.luminosity_resource)){
                        $scope.getUOMForResource($scope.jjson.luminosity_resource,"luminosity");
                    }
                    if(!$rootScope.isUndefined($scope.jjson.relative_humidity_resource)){
                        $scope.getUOMForResource($scope.jjson.relative_humidity_resource,"relative_humidity");
                    }
                    if(!$rootScope.isUndefined($scope.jjson.temperature_resource)){
                        $scope.getUOMForResource($scope.jjson.temperature_resource,"temperature");
                    }
                
                        if($rootScope.isUndefined($scope.jjson.extra_charts)){
                            
                            $scope.jjson.extra_charts = [];
                        
                        }else{
                            
                            console.log($scope.jjson.extra_charts);
                            $scope.jjson.extra_charts.forEach(function(ch,index){
                                $scope.getUOMForExtraResource(ch);
                            });
                        }
                }

                $scope.school = info.data;

            }).catch(function(e){
                $scope.loading = 0;
                if(e.status==404){
                    $scope.createSiteInfo();
                }else if(e.status==500){
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.statusText;                    
                    $scope.createSiteInfo();
                }
            });
        }
        
        
        $scope.saveBuilding = function(){
           $scope.loading = 1;
           $scope.error_text ="";
           $scope.school.json = JSON.stringify($scope.jjson);
           $scope.school.siteId = $scope.site_id;
           $scope.school.siteInfoId = $scope.info.siteInfoId;
           delete $scope.school.overObj;
           
           console.log($scope.school);
           var area = Area.updateSiteInfo($scope.info.siteInfoId,$scope.school);
           area.then(function(dot){
            $scope.loading = 0;
            $scope.saved();
            $scope.getInfo();
           }).catch(function(err){

                console.log(err);
                $scope.loading = 0;
                $scope.error_view = 1;
                $scope.error_text +=err.statusText;
           })
        }

        $scope.addExtraChart = function(){            
            $scope.add_a_chart_visible_form = 1;
        }

        $scope.cancel_new_chart = function(){
            $scope.add_a_chart_visible_form = 0;
            $scope.new_chart = {};
        }
        
        $scope.save_new_chart = function(){
         
            var chart = $scope.new_chart;
            $scope.jjson.extra_charts.push(chart);
            $scope.new_chart = {};
            $scope.add_a_chart_visible_form = 0;

        }
        $scope.removeThisChart = function(chart){

            var index = $scope.jjson.extra_charts.indexOf(chart);
            $scope.jjson.extra_charts.splice(index, 1);    
        }


       
        $scope.saved = function(){
            
            $('.saved').show();
            $('.saved').delay(3000).fadeOut('slow');
        }
      
    })
    .controller('SiteTopViewController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){

        $scope.building = {};
        $scope.zoom = 1;
        $scope.$on('onRepeatLast', function(scope, element, attrs){
            
            $( ".draggable" ).draggable({
                drag: function(){
                    var offset = $(this).offset();
                    var xPos = offset.left;
                    var yPos = offset.top;
                    console.log($(this).attr('data-area_id')+":"+offset.top);
                }
            });

              $('.draggable').each(function(){
                    
                var area_id = 'v2'+$(this).attr('data-area_id');
                $(this).offset({ top: localStorage.getItem('gaia_area_'+area_id+'_y'), left: localStorage.getItem('gaia_area_'+area_id+'_x') });

              });

              $scope.zoom = ($rootScope.isUndefined(localStorage.getItem('gaia_v4_zoom'))?1:localStorage.getItem('gaia_v4_zoom'));

        });
        


        
        $scope.zoomIn = function(){
            $scope.zoom=parseFloat(Number(Number(parseFloat($scope.zoom).toFixed(1))+0.1)).toFixed(1);
            console.log($scope.zoom);
            $scope.refreshAreas();
        }
        $scope.zoomOut = function(){
            $scope.zoom=parseFloat(Number(Number(parseFloat($scope.zoom).toFixed(1))-0.1)).toFixed(1);
            console.log($scope.zoom);
            $scope.refreshAreas();
        }
        $scope.refreshAreas = function(){
            $scope.building.areas.forEach(function(area){
                    
                area.style={
                    'width':area.element_width*$scope.zoom+'px',
                    'height':area.element_length*$scope.zoom+'px'
                };

            })
        }

        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id); 
            spark_areas.then(function(areas){
                $scope.building.areas = areas.data.sites;
                $scope.building.areas.forEach(function(area){
                    $scope.details(area);
                })
            });
        }

       
        $scope.details = function(area){
                      
            $scope.error_view = 0;
            $scope.error_text = "";           
            var k = Area.getSiteInfo(area.id);
            k.then(function(info){

               area.info = info.data;

                if(!$rootScope.isUndefined(area.info.json)){
                    var js = area.info.json; 
                        js = JSON.parse(js);
               
                        area.element_width  = (!$rootScope.isUndefined(js.width)?js.width:'200');
                        area.element_length = (!$rootScope.isUndefined(js.length)?js.length:'200');
                        area.element_height = (!$rootScope.isUndefined(js.height)?js.height:'200');
                }else{
                    area.element_width='200';
                    area.element_height='200';
                    area.element_length='300';
                }
                
                area.style={
                    'width':area.element_width*$scope.zoom+'px',
                    'height':area.element_length*$scope.zoom+'px'
                };




            }).catch(function(e){
                console.log(e);
                
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.data.message+"\n";
                
            });

        }





        $scope.openNav = function(area) {
            
            $scope.selected_area = area;
            var resources = Area.getResources(area.id);
            resources.then(function(info){
                

                $scope.selected_area.resources = info.data.resources;
                console.log(info);
                $scope.selected_area.resources.forEach(function(sensor,index){
                        var m = Sensor.getMeasurementsByResourceId(sensor.resourceId);
                            m.then(function(datas){                                
                                sensor.latest = parseFloat(datas.data.latest).toFixed(2);
                            });                           
                    });
                document.getElementById("myNav").style.width = "100%";

            }).catch(function(e){

                $scope.error_view = 1;
                $scope.error_text +="Sparkworks:"+e.data.message;
                console.log(e);
            });
}

        $scope.closeNav = function () {
            document.getElementById("myNav").style.width = "0%";
        }



        
       

        $scope.saveTopView = function(){
           
            $('.draggable').each(function(){
                    var area_id = 'v2'+$(this).attr('data-area_id');
                    
                    var offset = $(this).offset();
                    var xPos = offset.left;
                    var yPos = offset.top;
                    
                    localStorage.setItem('gaia_area_'+area_id+'_x', xPos);
                    localStorage.setItem('gaia_area_'+area_id+'_y', yPos);
                    localStorage.setItem('gaia_v4_zoom',$scope.zoom);

            })
            alert('OK');
           
        }

        

         

    })
    .controller('SiteNotificationsController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){


        $scope.getNotifications = function(){
            $scope.current_time = new Date().getTime();
            $scope.three_days_before = new Date($scope.current_time - 1000*60*60*24*20).getTime();
            $scope.limit = 2500;

            var notifications = site.getNotificationsCNIT($stateParams.id,$scope.three_days_before,$scope.current_time,$scope.limit);
                notifications.then(function(notification_list){
                    console.log(notification_list);
                    $scope.notifications = notification_list.data;

                },function(error){
                    console.log(error);
                })
        }



    })
    .controller('SiteSensorsController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){


        $scope.building = {};
        
        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id);
            spark_areas.then(function(areas){
                $scope.building.areas = areas.data.sites;
                console.log($scope.building.areas);

                $scope.building.areas.forEach(function(area){
                    $scope.details(area);
                })
            });
        }

       
        $scope.details = function(area){
            console.log(area);
          
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
                console.log(e);
            });
        }









        
       




        $scope.available_observes = [];
        $scope.available_observes.push({'name':'Light','encoded_name':'Light','uom':'lux'});
        $scope.available_observes.push({'name':'Energy','encoded_name':'Energy','uom':'mWh'});
        $scope.available_observes.push({'name':'Temperature','encoded_name':'Temperature','uom':'C'});
        $scope.available_observes.push({'name':'ComfortLevel','encoded_name':'comfort level','uom':'Raw'});
        $scope.available_observes.push({'name':'SharedResource','encoded_name':'shared resource','uom':'Raw'});
        $scope.virtual_sensors = [];

        $scope.save_new_virtual_sensor = function(){
            
            console.log("Filter Name:"+$scope.new_virtual_sensor.observes);


            var obs = $scope.available_observes.filter(function(item) {
                        return item.name === $scope.new_virtual_sensor.observes;
                        })[0];
             console.log(obs);

             
             
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
                console.log(d);
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
                console.log(d);
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
    .controller('SensorController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,UoM){
        
        $scope.sensor_measurements = {};
        $scope.dates_one = [];
        $scope.available_uoms = [];

        $scope.sensor = {
            id:$stateParams.id
        };
      

        var chart_details = Sensor.getDetailsFromSparks($scope.sensor.id);
            chart_details.then(function(chartdetails){
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

                $scope.sensor.meatrics = measurements.data;                  
                var the_data = measurements.data.day;                

                the_data.forEach(function(d,index){

                    
                    //TODO latest date = today
                    $scope.second_period_to_time = new Date(measurements.data.latestTime);
                    $scope.first_period_from_time = new Date($scope.second_period_to_time-47*24*60*60*1000);
                    

                    the_data[index] = $rootScope.addCommas(parseFloat(d).toFixed(2));
                    var m= new Date(measurements.data.latestTime-index*1000*3600*24);
                    $scope.dates_one[index] = $rootScope.convertForTimeAxis(m,'day');
                });
             
            $q.all(the_data).then(function(){
                $scope.dates_one.reverse();
                the_data.reverse();
                console.log($scope.dates_one);
              

              $scope.sensor_measurements.options = {
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b} <br/> {c} "+$scope.measurementUnit
                    },
                    legend: {
                        data:['Mesurements']
                    },
                    toolbox:$rootScope.toolbox,
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : $scope.dates_one
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+$scope.measurementUnit
                            }
                        }
                    ],
                    series : [
                        {
                            name:'Measurements',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:the_data
                        }
                    ]
                    };

                
            });
               
            }); 
         });

            
        $scope.open_new_measurements = function(){
            $scope.new_measurements_form = 1;
            $scope.virtual = {};
            $scope.virtual.time = new Date().getTime();
        }
        

        

        $scope.save_value_virtual = function(){
            console.log($scope.virtual);

            var data = [];
            data.push({
                "resourceId": $scope.sensor.id,
                "time": $scope.virtual.time,
                "value": $scope.virtual.value
            });
            var x = {data:data};


            var req = {
                 method: 'POST',
                 url: appConfig.main.apis.main+'ps/data',
                 headers: {
                   'Content-Type': 'application/json',"Authorization":"bearer "+appConfig.main.auth_token
                 },
                 data: x
            }
            $http(req).then(function(d){
                console.log(d);
                $scope.new_measurements_form = 0;
                $scope.virtual = {};
                $scope.afterPSPost();
            }).catch(function(error){
                    console.log("error");
                    console.log(error);
                    
                }); 
            

        }

        $scope.cancel_virtual_value = function(){
            $scope.virtual = {};
            $scope.new_measurements_form = 0;
        }

        $scope.afterPSPost = function(){
            
            $scope.loading = 1;
            

            

            console.log($scope.second_period_to_time);
            $scope.obj = {};
            $scope.obj.one = {};
            $scope.obj.one.from = $rootScope.convertToMiliseconds($scope.first_period_from_time);
            $scope.obj.one.to = $rootScope.convertToMiliseconds(new Date());
            $scope.obj.one.resourceID= $scope.sensor.id;
            $scope.obj.one.granularity = $scope.selected_granularity;
            $scope.obj.one.targetUom = $scope.selected_uom;

           /* $scope.obj.one.string = $scope.first_period_from_time+" TO "+$scope.second_period_to_time;*/

            console.log($scope.obj.one);           

            
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
            

            

            console.log($scope.second_period_to_time);
            $scope.obj = {};
            $scope.obj.one = {};
            $scope.obj.one.from = $rootScope.convertToMiliseconds($scope.first_period_from_time);
            $scope.obj.one.to = $rootScope.convertToMiliseconds($scope.second_period_to_time)+((1000*60*60*24)-2000);
            $scope.obj.one.resourceID= $scope.sensor.id;
            $scope.obj.one.granularity = $scope.selected_granularity;
            $scope.obj.one.targetUom = $scope.selected_uom;

           /* $scope.obj.one.string = $scope.first_period_from_time+" TO "+$scope.second_period_to_time;*/

            console.log($scope.obj.one);           

            
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


        $scope.setChartValues = function(){

                    $scope.sensor_measurements.options = {
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b} <br/> {c} "+$scope.measurementUnit
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
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:$scope.vals1
                        }
                    ]
                    };
                }


        
        
     


    })
    .controller('SiteSensorsComparisonController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,buildings,$filter){

        
        $scope.selected_sensors = [];
        $scope.available_sensors = [];
        $scope.line3 = {};

 
        

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

       

        $scope.getChart = function(){
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
            $scope.line3.options = {};
            $scope.line3.legend = {};
            $scope.line3.options.title = "";
            $scope.line3.options.tooltip = {trigger: 'axis'};
            $scope.line3.options.legend = {data:[]};
            $scope.line3.options.toolbox=$rootScope.toolbox;
            $scope.line3.options.calculable=true;

            $scope.line3.options.xAxis = [{
                type : 'category',
                boundaryGap : false,
                data : $scope.chart_times
            }];

            $scope.line3.options.yAxis =[{
                type : 'value',
                axisLabel : {
                    formatter: '{value} '+$scope.measurementUnit
                }
            }];

            $scope.line3.options.series = [];                        

            $scope.selected_sensors_to_show.forEach(function(sensor,index){
                
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
            $scope.datas = [];
            $scope.tdates = [];
            $scope.time = [];
            $scope.line3 = {};
            $scope.line3.options = {};
            $scope.line3.options.legend = {};
            $scope.line3.options.series = [];

           
            $scope.ress.forEach(function(res,index){
                
                
                $scope.legends.push($filter('translate')(res.sensor.name));
                var d = [];

                res.vals.data.forEach(function(dat,index){ 
                    d.push(parseFloat(dat.reading).toFixed(2));
                    var m = new Date(dat.timestamp);
                    if(res.sensor.resource_id==$scope.ress[0].sensor.resource_id)
                        $scope.time.push($rootScope.convertForTimeAxis(m,$scope.granularity));                         
                });

                $scope.datas.push({
                    name:$filter('translate')(res.sensor.name),
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:d
                });  

            });

          
            $scope.line3.options = {};
            $scope.line3.options={
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
                        series : $scope.datas
                    };
            $scope.loading=0;
        }


    })
.controller('TransportationController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Commuting,buildings){

        $scope.commuting = {};
        $scope.commuting.site_id = $stateParams.id;
        $scope.available_types = [];
        $scope.available_types.push({'name':'CAR','id':'1'});
        $scope.available_types.push({'name':'BUS','id':'1'});
        $scope.available_types.push({'name':'TRAIN','id':'1'});
        $scope.available_types.push({'name':'BIKE','id':'1'});
        $scope.available_types.push({'name':'UNDERGROUND','id':'1'});
        $scope.available_types.push({'name':'FOOT','id':'1'});
        $scope.available_types.push({'name':'OTHER','id':'1'});

    console.log("TRANSPORTATION");
    console.log(appConfig.main.TheUserName);

    $scope.save_commuting = function(){
        console.log($scope.commuting);
        var k = Commuting.save($scope.commuting);
        k.then(function(f){
            console.log(f);
        })
    };

})
.controller('SchoolCompareController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,buildings){
    
    $scope.comp_site = 0;
    $scope.loading = 0;
    $scope.line3 = {};
  
    $scope.getAllSites = function(){
        var schools = site.getAllSites();
        schools.then(function(respo){
            $scope.allSites = respo.data.sites;
        }).catch(function(e){
            $scope.error_view = 1;
            $scope.error_text = "We can not read the list of the other schools";
        });
    }

    $scope.getChart = function(this_school,other_school){
        $scope.loading = 1;
        $scope.ress = [];
        $scope.legends= {};
        $scope.legends.data = [];
        var x = 0;
        $scope.final_measurement_unit=this_school.targetUom;
          
        var chart_other_school = Sensor.getComparingQueryTimeRange(other_school);
        var chart_this_school  = Sensor.getComparingQueryTimeRange(this_school);

                    

        chart_this_school.then(function(vals){
            
            $scope.loading = 1;            
            var obj     = vals.data.results;
            var thevals   = obj[Object.keys(obj)[0]];
            $scope.ress.push({'sensor':'A','vals':thevals,'name':$scope.school_this_name});
            $scope.legends.data.push($scope.school_this_name);
            x++;
            if(x==2)
                $scope.drawchart();

        }).catch(function(error){
            $scope.loading=0;
            $scope.error_view = 1;
            $scope.error_text = error.statusText;
        });

        chart_other_school.then(function(vals){
            
            var obj     = vals.data.results;
            var thevals   = obj[Object.keys(obj)[0]];
            $scope.ress.push({'sensor':'B','vals':thevals,'name':$scope.school_other_name});
            $scope.legends.data.push($scope.school_other_name);
            $scope.loading = 1;
            x++;
            
            if(x==2)
                $scope.drawchart();

        }).catch(function(error){
            $scope.loading=0;
            $scope.error_view = 1;
            $scope.error_text = error.statusText;
        });

    }

    $scope.drawchart=  function(){
            
            $scope.datas = [];
            $scope.tdates = [];
            $scope.time = [];
            $scope.loading = 0;

            $scope.ress.forEach(function(res,index){
                var d = []; 

                res.vals.data.forEach(function(dat,index){
                    d.push(parseFloat(dat.reading).toFixed(2));
                    var m = new Date(dat.timestamp);
                    if(res.sensor.resource_id==$scope.ress[0].sensor.resource_id){
                        if($scope.time.indexOf($rootScope.convertForTimeAxis(m,$scope.granularity))<0)
                            $scope.time.push($rootScope.convertForTimeAxis(m,$scope.granularity));                         
                    }
                });
                $scope.datas.push({
                    name:res.name,
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:d
                });  
            });
            
            
            $scope.line3.options={
                       title : {
                            text: "",
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend:$scope.legends,
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
                                    formatter: '{value} '+$scope.final_measurement_unit
                                }
                            }
                        ],
                        series : $scope.datas
                    };

            console.log($scope.line3.options);
            $scope.loading=0;
        }

    $scope.compare = function(){
        
        $scope.error_view = 0;
        $scope.loading = 1;
        $scope.school_this_name = "AS";
        $scope.school_other_name = "VS";

        if(!$scope.type_of_measurement>0){
            $scope.error_view = 1;
            $scope.error_text = "You should select a measurement type from corresponding dropdown";
            $scope.loading = 0;
        }
        else if($rootScope.isUndefined($scope.from_time) || $rootScope.isUndefined($scope.to_time)){
            $scope.error_view = 1;
            $scope.error_text = "You should set the time range";   
            $scope.loading = 0;
        }
        else if(!$scope.comp_site>0){
            
            $scope.error_view = 1;
            $scope.error_text = "You should select a school from the site list";
            $scope.loading = 0;

        }else{
                var this_school = Area.getSiteInfo($stateParams.id);
                    this_school.then(function(th){
                        console.log(th);
                        $scope.school_this_name = $rootScope.getTranslatedName(th);
                        console.log($scope.school_this_name);
                        $scope.this_jjson = JSON.parse(th.data.json);
                    
                    var tsite =  Area.getSiteInfo($scope.comp_site);
                    
                    tsite.then(function(site) {
                    $scope.school_other_name = $rootScope.getTranslatedName(site);                   
                    

                    if($rootScope.isUndefined(site.data.json) || site.data.json === null || site.data.json==null || site.data.json=="null" || site.data.json === " " || site.data.json === ""){
                        $scope.loading = 0;
                        $scope.error_view = 1;
                        $scope.error_text = "The school you selected needs some configuration";
                    }
                    else{

                        $scope.jjson = JSON.parse(site.data.json);
                        switch(parseInt($scope.type_of_measurement)){ 
                            case 4:
                                
                                if($scope.jjson.energy_consumption_resource>0 && $scope.this_jjson.energy_consumption_resource>0){
                                    var other_school = {
                                        targetUom:$scope.this_jjson.energy_consumption_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.jjson.energy_consumption_resource
                                    }; 
                                    var this_school = {
                                        targetUom:$scope.this_jjson.energy_consumption_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.this_jjson.energy_consumption_resource
                                    };
                                    $scope.getChart(this_school,other_school);
                                    
                                }else{
                                    $scope.loading = 0;
                                    $scope.error_view = 1;
                                    $scope.error_text = "The school you selected needs some configuration in order to set the energy Consumption resource";
                                }
                                break;
                            case 3:
                                
                                if($scope.jjson.relative_humidity_resource>0 && $scope.this_jjson.relative_humidity_resource>0){
                                    var other_school = {
                                        targetUom:$scope.this_jjson.energy_consumption_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.jjson.relative_humidity_resource
                                    }; 
                                    var this_school = {
                                        targetUom:$scope.this_jjson.energy_consumption_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.this_jjson.relative_humidity_resource
                                    };
                                    $scope.getChart(this_school,other_school);
                                    $scope.loading = 0;
                                }else{
                                    $scope.loading = 0;
                                    $scope.error_view = 1;
                                    $scope.error_text = "The school you selected needs some configuration in order to set the energy relative humidity resource";
                                }
                                break;
                            case 2:
                                
                                if($scope.jjson.luminosity_resource>0 && $scope.this_jjson.luminosity_resource>0){
                                    var other_school = {
                                        targetUom:$scope.this_jjson.luminosity_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.jjson.luminosity_resource
                                    }; 
                                    var this_school = {
                                        targetUom:$scope.this_jjson.luminosity_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.this_jjson.luminosity_resource
                                    };
                                    $scope.getChart(this_school,other_school);
                                    $scope.loading = 0;
                                }else{
                                    $scope.loading = 0;
                                    $scope.error_view = 1;
                                    $scope.error_text = "The school you selected needs some configuration in order to set the luminosity resource";
                                }
                                $scope.loading = 0;
                                break;
                            case 1:
                                if($scope.jjson.temperature_resource>0 && $scope.this_jjson.temperature_resource>0){
                                    var other_school = {
                                        targetUom:$scope.this_jjson.temperature_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.jjson.temperature_resource
                                    }; 
                                    var this_school = {
                                        targetUom:$scope.this_jjson.temperature_resource_uom,
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.this_jjson.temperature_resource
                                    };
                                    $scope.getChart(this_school,other_school);
                                    
                                }else{
                                    $scope.loading = 0;
                                    $scope.error_view = 1;
                                    $scope.error_text = "The school you selected needs some configuration in order to set the Temperature resource";
                                }
                                $scope.loading = 0;
                                break;
                            default:
                                console.log('Default');
                                console.log($scope.type_of_measurement);
                        }
                        
                            
                    }
                }).catch(function(error){
                    $scope.loading = 0;
                    $scope.error_view = 1;
                    $scope.error_text = error.statusText;
                });

        });
    
                }
        
    }
    

    $scope.comp_choices = $rootScope.compare_strings;
    $scope.available_measurements = [];

    $scope.comp_choices.forEach(function(choice,index){
        $scope.available_measurements.push(choice);
    });


          

        

}).controller('SiteComparisonController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,buildings,$filter){
        console.log("SITE COMPARISON");
    var todate = new Date().getTime();
        $scope.right_side_visible = 0;
        $scope.line3 = {};
        $scope.line4 = {};
        $scope.line4 = {};
        $scope.line4.options={};
        $scope.loading = 0;

        $scope.first_period_from_time   = new Date(todate-100*1000*60*60*24).getTime();
        $scope.first_period_to_time     = todate;

        $scope.second_period_from_time  = new Date(todate-200*1000*60*60*24).getTime();
        $scope.second_period_to_time    = new Date(todate-100*1000*60*60*24).getTime();

        $scope.measurementUnit = "";

        var vals    = [];      
        $scope.metrics = [];
        $scope.schools = [];

        
        var t_site = Area.getSiteInfo($stateParams.id);
            t_site.then(function(respo){
                
             var json = JSON.parse(respo.data.json);
                console.log(json);
                $scope.schools.push({"id":$stateParams.id,"name":respo.data.name});
                $scope.school_two = $stateParams.id;
                $scope.school_one = $stateParams.id;

            if(!$rootScope.isUndefined(json.energy_consumption_resource)){
                $scope.metrics.push({'name':'energy','resource_id':json.energy_consumption_resource,'uom':json.energy_consumption_resource_uom});
            }
            if(!$rootScope.isUndefined(json.luminosity_resource)){
                $scope.metrics.push({'name':'luminosity','resource_id':json.luminosity_resource,'uom':json.luminosity_resource_uom});
            }
            if(!$rootScope.isUndefined(json.relative_humidity_resource)){
                $scope.metrics.push({'name':'relative_humidity','resource_id':json.relative_humidity_resource,'uom':json.relative_humidity_resource_uom});
            }
            if(!$rootScope.isUndefined(json.temperature_resource)){
                $scope.metrics.push({'name':'temperature','resource_id':json.temperature_resource,'uom':json.temperature_resource_uom});
            }

            
            
            json.extra_charts.forEach(function(chart,index){            
                    $scope.metrics.push({'name':chart.name,'resource_id':chart.resource_id,'uom':chart.uom});
            });

        });

        
        $scope.from = function(){
            console.log(0);
        }
        $scope.update = function(){
            $scope.right_side_visible = 1;
            $scope.vals1 = [];
            $scope.vals2 = [];
            $scope.tdates   = [];
            $scope.tdates2 = [];
            $scope.loading = 1;            


           
            var result = $filter('filter')($scope.metrics, {'resource_id':$scope.metric});             
            if(result.length>0)
                result = result[0];

            if(!$rootScope.isUndefined(result)){
                console.log("result");
                console.log(result);
                console.log(result);
                console.log(result);
                console.log(result);
                 

                var sensor = result;
                $scope.measurementUnit = sensor.uom;
                $scope.obj = {};
                $scope.obj.one = {};
                $scope.obj.one.from = $scope.first_period_from_time.getTime();
                $scope.obj.one.to = $scope.first_period_to_time.getTime();
                $scope.obj.one.resourceID= sensor.resource_id;
                $scope.obj.one.granularity = $scope.granularity; 
                $scope.obj.one.targetUom = $scope.measurementUnit;

             
                $scope.obj.one.string = $filter('date')($scope.first_period_from_time.getTime(), 'dd/MM/yyyy')+'-'+$filter('date')($scope.first_period_to_time.getTime(), 'dd/MM/yyyy');


                $scope.obj.two = {};
                $scope.obj.two.to = $scope.second_period_to_time.getTime();
                $scope.obj.two.from = $scope.second_period_from_time.getTime();
                $scope.obj.two.resourceID = sensor.resource_id;
                $scope.obj.two.granularity = $scope.granularity;
                $scope.obj.two.targetUom = $scope.measurementUnit;

              
            $scope.obj.two.string = $filter('date')($scope.second_period_from_time.getTime(), 'dd/MM/yyyy')+'-'+$filter('date')($scope.second_period_to_time.getTime(), 'dd/MM/yyyy');

            
            $scope.obj.resourceID = sensor;
            


            var first = Sensor.getComparingQueryTimeRange($scope.obj.one);
            
            first.then(function(vals){
               
                var obj     = vals.data.results;
                var vals1   = obj[Object.keys(obj)[0]];
                $scope.obj.one.sum = $rootScope.addCommas(parseFloat(vals1.summary).toFixed(2));
                $scope.obj.one.average = $rootScope.addCommas(parseFloat(vals1.average).toFixed(2));
                vals1 = vals1.data;
                

                vals1.forEach(function(val,index){ 
                    $scope.vals1.push(parseFloat(val.reading).toFixed(2));
                    var m = new Date(val.timestamp);                            
                    $scope.tdates.push($rootScope.convertForTimeAxis(m,$scope.granularity));
                });


                    $scope.line3.options={
                       title : {
                            text: $scope.obj.one.string,
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                                data:[$scope.obj.one.string]
                            },
                        toolbox:$rootScope.toolbox,
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
                                    formatter: '{value} '+$scope.measurementUnit
                                }
                            }
                        ],
                        series : [
                            {
                                name:$scope.obj.one.string,
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:$scope.vals1
                            }                            
                        ]
                    };
                });

                var second = Sensor.getComparingQueryTimeRange($scope.obj.two);
                    second.then(function(vals_2){ 
                        
                        $scope.loading = 0;                                                                      

                        var obj = vals_2.data.results;

                        var vals2 = obj[Object.keys(obj)[0]];   
                        $scope.obj.two.sum = $rootScope.addCommas(parseFloat(vals2.summary).toFixed(2));
                        $scope.obj.two.average = $rootScope.addCommas(parseFloat(vals2.average).toFixed(2));
                        vals2 = vals2.data;
                        vals2.forEach(function(val,index){
                            $scope.vals2.push(parseFloat(val.reading).toFixed(2));
                            var m = new Date(val.timestamp);                            
                            $scope.tdates2.push($rootScope.convertForTimeAxis(m,$scope.granularity));
                        });
                                               
                        $scope.count++;

                        $scope.line4.options={
                           title : {
                                text: $scope.obj.two.string,
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:[$scope.obj.two.string]
                            },
                            toolbox:$rootScope.toolbox,
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : $scope.tdates2
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLabel : {
                                        formatter: '{value} '+$scope.measurementUnit
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:$scope.obj.two.string,
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:$scope.vals2
                                }
                            ]
                        };
                        
                    });

            
            }else{
                $scope.loading = 0;
                alert("Please select metric");
            }
        }

        
    })
    .controller('SiteViewController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){
        

        $scope.getbOptions = function(){
            
            var boptions = new Array;
            boptions.push({
                "class":'btn btn-secondary',
                "action":'5mins',
                "translate":'per_5mins'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'hour',
                "translate":'per_hour'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'day',
                "translate":'per_day'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'month',
                "translate":'per_month'
            });    
            console.log(boptions);
            return boptions;
        }
        
        
        $scope.building = {};
        $scope.line3 = {};
        $scope.extra_charts = [];
        $scope.additional_charts = [];        
              


            
            var k = Area.getSiteInfo($stateParams.id);
            k.then(function(info){
                $scope.loading = 0;
                console.log("Info");
                console.log(info);
                $scope.info = info.data;

                $scope.building = info.data;
                $scope.building.details = info.data;
                $scope.sitename = info.data.greekLocalizedName;
                var json = JSON.parse(info.data.json);

                $scope.building.json = JSON.parse(info.data.json);
                $scope.jjson = $scope.building.json;
                if($rootScope.isUndefined($scope.jjson.extra_charts)){
                    $scope.jjson.extra_charts = [];
                }

                $scope.energy_chart = {};
                $scope.energy_chart.resource_id = json.energy_consumption_resource;
                $scope.energy_chart.boptions = $scope.getbOptions();
                $scope.energy_chart.uom = json.energy_consumption_resource_uom;
                $scope.energy_chart.measurementUnit = json.energy_consumption_resource_uom;
                $scope.energy_chart.step = json.energy_consumption_resource_step;
                $scope.energy_chart.name = '';
           
                $scope.getCentralChart();



                if(!$rootScope.isUndefined(json.luminosity_resource)){            
                    
                     var vchart = {
                            'resource_id':json.luminosity_resource,
                            'step':json.luminosity_resource_step,
                            'uom':json.luminosity_resource_uom,
                            'name':'luminosity',
                            'translated_name':'luminosity',
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':json.luminosity_resource_uom                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                }
                if(!$rootScope.isUndefined(json.relative_humidity_resource)){            
                    
                     var vchart = {
                            'resource_id':json.relative_humidity_resource,
                            'step':json.relative_humidity_resource_step,
                            'uom':json.relative_humidity_resource_uom,
                            'name':'relative_humidity',
                            'translated_name':'relative_humidity',
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':json.relative_humidity_resource_uom                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                }
                if(!$rootScope.isUndefined(json.temperature_resource)){            
                    
                     var vchart = {
                            'resource_id':json.temperature_resource,
                            'step':json.temperature_resource_step,
                            'uom':json.temperature_resource_uom,
                            'name':'temperature',
                            'translated_name':'temperature',
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':json.temperature_resource_uom                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                }


                if(!$rootScope.isUndefined(json.extra_charts)){

                    json.extra_charts.forEach(function(chart){
                         var vchart = {
                            'resource_id':chart.resource_id,
                            'step':chart.step,
                            'uom':chart.uom,
                            'name':chart.name,
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':chart.uom
                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                    });                    
                }
                



            }).catch(function(e){
                $scope.loading = 0;
                if(e.status==404){
                    $scope.createSiteInfo();
                }else if(e.status==500){
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.statusText;                    
                    $scope.createSiteInfo();
                }
            });
        

        $scope.changeRegularity = function(button,chartt){
            console.log('Change Regularity');
            //manos
            var chart = chartt;
            chart.step = button.action;
            chart.loading = 1;

            
            $('*[data-attr="btn_'+chart.resource_id+'"]').removeClass('active');
            button.class+=" active";            
            
            console.log(chart);
            console.log("Chart MeasUnit:"+chart.measurementUnit);

                var latest = Sensor.getLatestMeasurementsByResourceIdAndUOM(chart.resource_id,chart.measurementUnit);

            
                latest.then(function(metrics){
                
                var dates = [];
                var metrics_of_this = [];

                    chart.average_per_day = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                    chart.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));
                
                var dateObj = new Date(metrics.data.latestTime);
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var newdate = day + "/" + month + "/" + year;                


                chart.latest = {
                    time:newdate,
                    val:parseFloat(metrics.data.latest).toFixed(2)
                };
                chart.loading = 0;
                
                var d = new Date(metrics.data.latestTime).getTime();               

                switch (chart.step) {

                    case '5mins':                        
                        metrics_of_this = metrics.data.minutes5.reverse();
                        var i = 0;
                        while(i<metrics.data.minutes5.length){
                            
                            var m = new Date(d-i*1000*60*5);
                             dates.push(m.getHours()+":"+m.getMinutes()+":00");
                            i++;
                        }
                        break; 
                    case 'hour':
                         metrics_of_this = metrics.data.minutes60.reverse();  
                        var i = 0;
                        while(i<metrics.data.minutes60.length){
                            var m = new Date(d-i*1000*60*60);
                            dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                            i++;
                        }

                        break; 
                    case 'day':
                         metrics_of_this = metrics.data.day.reverse();

                         var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                            i++;
                        }

                        break; 
                    case 'month':
                         metrics_of_this = metrics.data.month.reverse(); 
                         var i = 0;
                        while(i<metrics.data.month.length){
                            var m = new Date(d-i*1000*60*60*24*30);
                            dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                            i++;
                        }            
                        break; 
                    default: 
                        var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m);
                            i++;
                        } 
                         metrics_of_this = metrics.data.day.reverse();

                }
                
                 chart.options ={
                
                   title : {
                        text: ($rootScope.isUndefined(chart.translated_name)?chart.name:"")+" ("+chart.measurementUnit+")",
                    },
                    legend : {
                        data:[chart.name]
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{a} <br/>{b} : {c} "+chart.measurementUnit
                    },
                    toolbox: $rootScope.toolbox,
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : dates.reverse()
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '
                            }
                            
                        }
                    ],
                    series : [
                        {
                            name:$scope.sitename,
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                            data:metrics_of_this
                        }
                    ]
                };
               chart.loading = 0;

                }).catch(function(error) {
                        
                        chart.loading = 0;
                        chart.error = {};
                        chart.error.view = 1;
                        chart.error.text = error.status+" "+error.statusText;

                    });
        }
         $scope.changeLineChartIn = function(timeperiod,chart){
            console.log("Change Line Chart");
            console.log(chart);
            chart.loading = 1;
            chart.step = timeperiod;

            var latest = Sensor.getLatestMeasurementsByResourceIdAndUOM(chart.resource_id,chart.uom);
                latest.then(function(metrics){               
                console.log("METRICS");
                console.log(chart.name);
                console.log(metrics);

                var dates = [];
                var metrics_of_this = [];

                chart.average_per_day = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                chart.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));
                
                var dateObj = new Date(metrics.data.latestTime);
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var newdate = day + "/" + month + "/" + year;                


                chart.latest = {
                    time:newdate,
                    val:parseFloat(metrics.data.latest).toFixed(2)
                };
                
                var d = new Date(metrics.data.latestTime).getTime();               

                switch (chart.step) {
                    case '5mins':                        
                        metrics_of_this = metrics.data.minutes5.reverse();
                        var i = 0;
                        while(i<metrics.data.minutes5.length){
                            
                            var m = new Date(d-i*1000*60*5);
                             dates.push(m.getHours()+":"+m.getMinutes()+":00");
                            i++;
                        }
                        break; 
                    case 'hour':
                         metrics_of_this = metrics.data.minutes60.reverse();  
                        var i = 0;
                        while(i<metrics.data.minutes60.length){
                            var m = new Date(d-i*1000*60*60);
                            dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                            i++;
                        }

                        break; 
                    case 'day':
                         metrics_of_this = metrics.data.day.reverse();

                         var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                            i++;
                        }

                        break; 
                    case 'month':
                         metrics_of_this = metrics.data.month.reverse(); 
                         var i = 0;
                        while(i<metrics.data.month.length){
                            var m = new Date(d-i*1000*60*60*24*30);
                            dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                            i++;
                        }            
                        break; 
                    default: 
                        var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m);
                            i++;
                        } 
                         metrics_of_this = metrics.data.day.reverse();             
                }
                
                 chart.options ={
                
                   title : {
                        text: ($rootScope.isUndefined(chart.translated_name)?chart.name:"")+" ("+chart.measurementUnit+")",
                    },
                    legend : {
                        data:[chart.name]
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter:function (params) {
                            let rez = parseFloat(params[0].data).toFixed(2)+" "+chart.measurementUnit;
                            return rez;
                        }
                    },
                    toolbox: $rootScope.toolbox,
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : dates.reverse()
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '
                            }
                            
                        }
                    ],
                    series : [
                        {
                            name:$scope.sitename,
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                            data:metrics_of_this
                        }
                    ]
                };
               chart.loading = 0;

                }).catch(function(error) {
                        
                        chart.loading = 0;
                        chart.error = {};
                        chart.error.view = 1;
                        chart.error.text = error.status+" "+error.statusText;

                    });


           }



           $scope.getCentralChart = function(){
                
                $scope.energy_chart.loading = 1;
                var latest = Sensor.getLatestMeasurementsByResourceIdAndUOM($scope.energy_chart.resource_id,$scope.energy_chart.uom);
                latest.then(function(metrics){
                        console.log(metrics);
                        $scope.average_per_day   = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                        $scope.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));

                        var dates = [];
                        var metrics_of_this = [];
                        var d = new Date(metrics.data.latestTime).getTime();
                        switch ($scope.energy_chart.step) {
                                case '5mins':                        
                                    metrics_of_this = metrics.data.minutes5.reverse();
                                    var i = 1;
                                    while(i<metrics.data.minutes5.length){
                                        
                                        var m = new Date(d-i*1000*60*5);
                                        dates.push(m.getHours()+":"+m.getMinutes()+":00");

                                        i++;
                                    }
                                    break; 
                                case 'hour':
                                     metrics_of_this = metrics.data.minutes60.reverse();  
                                    var i = 1;
                                    while(i<metrics.data.minutes60.length){
                                        var m = new Date(d-i*1000*60*60);
                                        dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                                        
                                        i++;
                                    }

                                    break; 
                                case 'day':
                                     metrics_of_this = metrics.data.day.reverse();

                                     var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                                        i++;
                                    }

                                    break; 
                                case 'month':
                                     metrics_of_this = metrics.data.month.reverse(); 
                                     var i = 1;
                                    while(i<metrics.data.month.length){
                                        var m = new Date(d-i*1000*60*60*24*30);

                                        dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                                        
                                        i++;
                                    }            
                                    break; 
                                default: 
                                    var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m);
                                        i++;
                                    } 
                                     metrics_of_this = metrics.data.day.reverse();  
                        }
                        metrics_of_this.forEach(function(metric,index){
                            metrics_of_this[index] = metric.toFixed(2);
                        })

                        $scope.energy_chart.options={
                
                               title : {
                                    text: "("+$scope.energy_chart.uom+")",
                                },
                                legend : {
                                    data:[$scope.sitename]
                                },
                                tooltip : {
                                    trigger: 'axis',
                                    formatter: "{a} <br/>{b} : {c} "+$scope.energy_chart.uom
                                },
                                toolbox: $rootScope.toolbox,
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : dates.reverse()

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
                                        name:$scope.sitename,
                                        type:'line',
                                        smooth:true,
                                        itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                                        data:metrics_of_this
                                    }
                                ]
                            };


                            $scope.energy_chart.loading = 0;



                }).catch(function(error) {
                        
                        $scope.energy_chart.loading = 0;
                        $scope.energy_chart.error = {};
                        $scope.energy_chart.error.view = 1;
                        $scope.energy_chart.error.text = error.status+" "+error.statusText;

                    });
           }



    })
    .controller('SiteController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){
        
        $rootScope.recommendations = 0;

         $rootScope.toolbox = {
            show : true,
            feature : {
                restore : {show: true, title: "Restore"},
                saveAsImage : {show: true, title: "Save as image"},
                dataZoom : {show: true,title:{zoom:"Zoom",back:"Reset Zoom"}},
                dataView : {show: true,title:"DataView",lang: ['Data View', 'Close']},
                magicType : {show: true, type: ['line', 'bar'],title:{
                    line: 'Line',
                    bar: 'Bar',
                    force: 'Force',
                    chord: 'Chord',
                    pie: 'Pie',
                    funnel: 'Funnel'
                }},
            }
        };


        $scope.add_a_chart_visible_form = 0;
        $scope.building = {};
        $scope.areas = [];
        $scope.line3 = {};
        $scope.new_chart = {};
        $scope.extra_charts = [];
        $scope.additional_charts = [];
        
        $scope.bar4 = {};
        $scope.visual_sources = [{id:1,texts:"Electricity"},
                                 {id:2,texts:"Petrol"},
                                 {id:3,texts:"Gas"}];

        var t_site = site.getDetails($stateParams.id);

        var available_resources = site.getResources($stateParams.id);
        available_resources.then(function(resources,index){
            $scope.available_resources = [];
            resources.data.resources.forEach(function(tresource){
                $scope.available_resources.push({id:tresource.resourceId,uri:tresource.uri});
            });
        });

        var t_areas = site.getAreas($stateParams.id);       
        t_areas.then(function(areas){

            $scope.building.areas = areas.data.items;
            $scope.building.areas.forEach(function(area,index){
                var the_area = {};
                $scope.areas.push(area.name);

                var area_sensors = Area.getSensors(area.id);
                
                    area_sensors.then(function(sensors){

                        area.sensors = sensors.data.items;    
                    });
                });
        });

        t_site.then(function(site){
            
            
           $scope.building.details = site.data;
           $scope.sitename = site.data.item.name;
           var json = JSON.parse(site.data.item.json);
           console.log("*******************DETAILS***********");
           console.log(json);
           console.log(json);
           console.log(json);
           $scope.building.extra_charts = json.extra_charts;
           

           $scope.building.additional_charts = [];
           
            if(json.temperature_resource){
            
                $scope.building.additional_charts.push({
                    'resource':json.temperature_resource,
                    'step':json.temperature_resource_step,
                    'uom':json.temperature_resource_uom
                });
            }
           


           $scope.building.additional_charts.forEach(function(chart,index){
            var time_frame = 'day';
                
                if(chart.step!='')
                    time_frame = chart.step;
            
                if(chart.uom!=''){
                    chart.measurementUnit = chart.uom;
                }
                else{
                    var chart_details = Sensor.getDetailsFromSparks(chart.resource);
                    chart_details.then(function(chartdetails){
                        chart.measurementUnit = chartdetails.data.uom;

                    });
                }
           });
          
           
           $scope.building.extra_charts.forEach(function(chart,index){

                var chart_details = Sensor.getDetailsFromSparks(chart.resource_id);
                chart_details.then(function(chartdetails){
                    chart.measurementUnit = chartdetails.data.uom;
                    console.log("MU:"+chart.measurementUnit);
                    $scope.changeLineChartIn('day',chart);
                });
                
           });
    
            $scope.building.energy_consumtion_meter = json.energy_consumption_resource;
            var k = Sensor.getDetailsFromSparks($scope.building.energy_consumtion_meter);   
            $scope.central_chart_step = json.energy_consumption_resource_step;
           
            k.then(function(sensor_details){
                
                $scope.measurementUnit = 'kWh';
                $scope.getCentralChart();
               
            });

        }, function(reason) {
          console.log(reason);
        });


         $scope.changeLineChartIn = function(timeperiod,chart){

            chart.step = timeperiod;
            var latest = Sensor.getMeasurementsByResourceId(chart.resource_id);
                latest.then(function(metrics){               

                var dates = [];
                var metrics_of_this = [];

                chart.average_per_day = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                chart.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));
                
                var dateObj = new Date(metrics.data.latestTime);
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var newdate = day + "/" + month + "/" + year;                


                chart.latest = {
                    time:newdate,
                    val:parseFloat(metrics.data.latest).toFixed(2)
                };
                
                var d = new Date(metrics.data.latestTime).getTime();               

                switch (chart.step) {
                    case '5mins':                        
                        metrics_of_this = metrics.data.minutes5.reverse();
                        var i = 1;
                        while(i<metrics.data.minutes5.length){
                            
                            var m = new Date(d-i*1000*60*5);
                             dates.push(m.getHours()+":"+m.getMinutes()+":00");
                            i++;
                        }
                        break; 
                    case 'hour':
                         metrics_of_this = metrics.data.minutes60.reverse();  
                        var i = 1;
                        while(i<metrics.data.minutes60.length){
                            var m = new Date(d-i*1000*60*60);
                            dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                            i++;
                        }

                        break; 
                    case 'day':
                         metrics_of_this = metrics.data.day.reverse();

                         var i = 1;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                            i++;
                        }

                        break; 
                    case 'month':
                         metrics_of_this = metrics.data.month.reverse(); 
                         var i = 1;
                        while(i<metrics.data.month.length){
                            var m = new Date(d-i*1000*60*60*24*30);
                            dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                            i++;
                        }            
                        break; 
                    default: 
                        var i = 1;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m);
                            i++;
                        } 
                         metrics_of_this = metrics.data.day.reverse();             
                }
                
                 chart.options ={
                
                   title : {
                        text: chart.name+" ("+chart.measurementUnit+")",
                    },
                    legend : {
                        data:[chart.name]
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    toolbox: $rootScope.toolbox,
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : dates.reverse()
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '/*+chart.measurementUnit*/
                            }
                            
                        }
                    ],
                    series : [
                        {
                            name:$scope.sitename,
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                            data:metrics_of_this
                        }
                    ]
                };
               

                });


           }



           $scope.getCentralChart = function(){

                var latest = Sensor.getMeasurementsByResourceIdAndUOM($scope.building.energy_consumtion_meter,'kWh');
                latest.then(function(metrics){
                        console.log(metrics);
                        $scope.average_per_day   = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                        $scope.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));

                        var dates = [];
                        var metrics_of_this = [];
                        var d = new Date(metrics.data.latestTime).getTime();
                        switch ($scope.central_chart_step) {
                                case '5mins':                        
                                    metrics_of_this = metrics.data.minutes5.reverse();
                                    var i = 1;
                                    while(i<metrics.data.minutes5.length){
                                        
                                        var m = new Date(d-i*1000*60*5);
                                        dates.push(m.getHours()+":"+m.getMinutes()+":00");

                                        i++;
                                    }
                                    break; 
                                case 'hour':
                                     metrics_of_this = metrics.data.minutes60.reverse();  
                                    var i = 1;
                                    while(i<metrics.data.minutes60.length){
                                        var m = new Date(d-i*1000*60*60);
                                        dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                                        
                                        i++;
                                    }

                                    break; 
                                case 'day':
                                     metrics_of_this = metrics.data.day.reverse();

                                     var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                                        i++;
                                    }

                                    break; 
                                case 'month':
                                     metrics_of_this = metrics.data.month.reverse(); 
                                     var i = 1;
                                    while(i<metrics.data.month.length){
                                        var m = new Date(d-i*1000*60*60*24*30);

                                        dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                                        
                                        i++;
                                    }            
                                    break; 
                                default: 
                                    var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m);
                                        i++;
                                    } 
                                     metrics_of_this = metrics.data.day.reverse();  
                        }

                        $scope.energy_chart.options={
                
                               title : {
                                    text: "("+$scope.measurementUnit+")",
                                },
                                legend : {
                                    data:[$scope.sitename]
                                },
                                tooltip : {
                                    trigger: 'axis',
                                    formatter: "{a} <br/>{b} : {c} "+$scope.measurementUnit
                                },
                                toolbox: $rootScope.toolbox,
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : dates.reverse()

                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} '+$scope.measurementUnit
                                        }                                        
                                    }
                                ],
                                series : [
                                    {
                                        name:$scope.sitename,
                                        type:'line',
                                        smooth:true,
                                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                        data:metrics_of_this
                                    }
                                ]
                            };






                });
           }






        $scope.goToAreas = function(){
            $location.path('page/building/areas/'+$stateParams.id);
        }

       $scope.goToMeasurements = function(){
            $location.path('page/building/add_measurements/'+$stateParams.id);
       }
       $scope.goToEdit = function(){
            $location.path('page/building/edit/'+$stateParams.id);
       }
       $scope.goToAnomalies = function(){
            $location.path('page/building/anomalies/'+$stateParams.id);
       }
       $scope.goToTopView = function(){
            $location.path('page/building/topview/'+$stateParams.id);
       }
        $scope.goToSensors = function(){
            $location.path('page/building/sensors/'+$stateParams.id);
        }
        $scope.goToDashboard = function(){
            $location.path('page/building/view/'+$stateParams.id);   
        }
        $scope.goToComparison = function(){
            $location.path('page/building/comparison/'+$stateParams.id);      
        }
        $scope.goToNotifications = function(){
            $location.path('page/building/notifications/'+$stateParams.id);         
        }


        
        







        

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

        // Build ECharts with Bar, Line, Pie, Radar, Scatter, Chord, Gauge, Funnel

        $scope.line1 = {};
        $scope.line2 = {};
        $scope.line4 = {};

        $scope.bar1 = {};
        $scope.bar2 = {};
        $scope.bar3 = {};
        
        $scope.bar5 = {};

        $scope.pie1 = {};
        $scope.pie2 = {};
        $scope.pie4 = {};

        $scope.scatter1 = {};
        $scope.scatter2 = {};

        $scope.radar1 = {};
        $scope.radar2 = {};

        $scope.gauge1 = {};

        $scope.chord1 = {};

        $scope.funnel1 = {};

        $scope.line1.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Highest temperature','Lowest temperature']
            },
            toolbox: $rootScope.toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value} °C'
                    }
                }
            ],
            series : [
                {
                    name:'Highest temperature',
                    type:'line',
                    data:[11, 11, 15, 13, 12, 13, 10],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                },
                {
                    name:'Lowest temperature',
                    type:'line',
                    data:[1, -2, 2, 5, 3, 2, 0],
                    markPoint : {
                        data : [
                            {name : 'Lowest temperature', value : -2, xAxis: 1, yAxis: -1.5}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : 'Average'}
                        ]
                    }
                }
            ]
        };
        $scope.line2.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Email','Affiliate','Video Ads','Direct','Search']
            },
            toolbox: $rootScope.toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Email',
                    type:'line',
                    stack: 'Sum',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'Affiliate',
                    type:'line',
                    stack: 'Sum',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'Video Ads',
                    type:'line',
                    stack: 'Sum',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'Direct',
                    type:'line',
                    stack: 'Sum',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'Search',
                    type:'line',
                    stack: 'Sum',
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
       
        $scope.line4.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Email','Affiliate','Video Ads','Direct','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Email',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'Affiliate',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'Video Ads',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'Direct',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'Search',
                    type:'line',
                    stack: 'Sum',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };

        $scope.bar1.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Evaporation','Precipitation']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'Evaporation',
                    type:'bar',
                    data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                },
                {
                    name:'Precipitation',
                    type:'bar',
                    data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                    markPoint : {
                        data : [
                            {name : 'Highest', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                            {name : 'Lowest', value : 2.3, xAxis: 11, yAxis: 3}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name : 'Average'}
                        ]
                    }
                }
            ]
        };
        $scope.bar2.options = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow'
                }
            },
            legend: {
                data:['AirCondition','Heating','Lighting','Machinery Operations','Others']
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'AirCondition',
                    type:'bar',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'Heating',
                    type:'bar',
                    stack: 'Ads',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'Lighting',
                    type:'bar',
                    stack: 'Ads',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'Machinery Operations',
                    type:'bar',
                    stack: 'Ads',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'Others',
                    type:'bar',
                    data:[862, 1018, 964, 1026, 1679, 1600, 1570],
                    markLine : {
                        itemStyle:{
                            normal:{
                                lineStyle:{
                                    type: 'dashed'
                                }
                            }
                        },
                        data : [
                            [{type : 'min'}, {type : 'max'}]
                        ]
                    }
                }
                
            ]
        };
        $scope.bar3.options = {
            title : {
                text: 'WeekDay',
                subtext: 'Energy Consumption per week day'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['2016']
            },
            toolbox:$rootScope.toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'value',
                    boundaryGap : [0, 0.01]
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    data : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
                }
            ],
            series : [
                {
                    name:'2016',
                    type:'bar',
                    data:[25000,88203, 77489, 69034, 104970, 131744, 26498]
                }
            ]
        };
        
        $scope.bar5.options = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {         
                    type : 'shadow'
                }
            },
            legend: {
                data:['Profit', 'Cost', 'Income']
            },
            toolbox: $rootScope.toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'value'
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisTick : {show: false},
                    data : ['Mon.','Tue.','Wed.','Thu.','Fri.','Sat.','Sun.']
                }
            ],
            series : [
                {
                    name:'Profit',
                    type:'bar',
                    itemStyle : { normal: {label : {show: true, position: 'inside'}}},
                    data:[200, 170, 240, 244, 200, 220, 210]
                },
                {
                    name:'Income',
                    type:'bar',
                    stack: 'Sum',
                    barWidth : 5,
                    itemStyle: {normal: {
                        label : {show: true}
                    }},
                    data:[320, 302, 341, 374, 390, 450, 420]
                },
                {
                    name:'Cost',
                    type:'bar',
                    stack: 'Sum',
                    itemStyle: {normal: {
                        label : {show: true, position: 'left'}
                    }},
                    data:[-120, -132, -101, -134, -190, -230, -210]
                }
            ]
        };

        $scope.pie1.options = {
            title : {
                text: 'Traffic Source',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:['Direct','Email','Affiliate','Video Ads','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'Vist source',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'Direct'},
                        {value:310, name:'Email'},
                        {value:234, name:'Affiliate'},
                        {value:135, name:'Video Ads'},
                        {value:1548, name:'Search'}
                    ]
                }
            ]
        };
        $scope.pie2.options = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:['Direct','Email','Affiliate','Video Ads','Search']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'Traffic source',
                    type:'pie',
                    radius : ['50%', '70%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true,
                                position : 'center',
                                textStyle : {
                                    fontSize : '30',
                                    fontWeight : 'bold'
                                }
                            }
                        }
                    },
                    data:[
                        {value:335, name:'Direct'},
                        {value:310, name:'Email'},
                        {value:234, name:'Affiliate'},
                        {value:135, name:'Video Ads'},
                        {value:1548, name:'Search'}
                    ]
                }
            ]
        };
        $scope.pie4.options = {
            title : {
                text: 'Nightingale rose diagram',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            series : [
                {
                    name:'Radius model',
                    type:'pie',
                    radius : [20, 110],
                    center : ['25%', 200],
                    roseType : 'radius',
                    width: '40%',       // for funnel
                    max: 40,            // for funnel
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[
                        {value:10, name:'rose1'},
                        {value:5, name:'rose2'},
                        {value:15, name:'rose3'},
                        {value:25, name:'rose4'},
                        {value:20, name:'rose5'},
                        {value:35, name:'rose6'},
                        {value:30, name:'rose7'},
                        {value:40, name:'rose8'}
                    ]
                },
                {
                    name:'Area model',
                    type:'pie',
                    radius : [30, 110],
                    center : ['75%', 200],
                    roseType : 'area',
                    x: '50%',               // for funnel
                    max: 40,                // for funnel
                    sort : 'ascending',     // for funnel
                    data:[
                        {value:10, name:'rose1'},
                        {value:5, name:'rose2'},
                        {value:15, name:'rose3'},
                        {value:25, name:'rose4'},
                        {value:20, name:'rose5'},
                        {value:35, name:'rose6'},
                        {value:30, name:'rose7'},
                        {value:40, name:'rose8'}
                    ]
                }
            ]

        };

        $scope.scatter1.options = {
            title : {
                text: 'Height and weight distribution',
                subtext: 'Data: Heinz  2003'
            },
            tooltip : {
                trigger: 'axis',
                showDelay : 0,
                formatter : function (params) {
                    if (params.value.length > 1) {
                        return params.seriesName + ' :<br/>'
                           + params.value[0] + 'cm ' 
                           + params.value[1] + 'kg ';
                    }
                    else {
                        return params.seriesName + ' :<br/>'
                           + params.name + ' : '
                           + params.value + 'kg ';
                    }
                },  
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                }
            },
            legend: {
                data:['Femail','Male']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            xAxis : [
                {
                    type : 'value',
                    scale:true,
                    axisLabel : {
                        formatter: '{value} cm'
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale:true,
                    axisLabel : {
                        formatter: '{value} kg'
                    }
                }
            ],
            series : [
                {
                    name:'Femail',
                    type:'scatter',
                    data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                        [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                        [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                        [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                        [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                        [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                        [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                        [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                        [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                        [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                        [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                        [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                        [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                        [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                        [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                        [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                        [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                        [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                        [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                        [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                        [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                        [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                        [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                        [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                        [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                        [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                        [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                        [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                        [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                        [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                        [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                        [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                        [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                        [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                        [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                        [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                        [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                        [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                        [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                        [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                        [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                        [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                        [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                        [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                        [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                        [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                        [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                        [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                        [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                        [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                        [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                        [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
                    ],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                },
                {
                    name:'Male',
                    type:'scatter',
                    data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
                        [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
                        [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
                        [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
                        [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
                        [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
                        [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
                        [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
                        [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
                        [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
                        [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
                        [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
                        [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
                        [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
                        [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
                        [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
                        [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
                        [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
                        [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
                        [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
                        [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
                        [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
                        [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
                        [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
                        [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
                        [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
                        [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
                        [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
                        [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
                        [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
                        [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
                        [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
                        [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
                        [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
                        [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
                        [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
                        [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
                        [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
                        [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
                        [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
                        [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
                        [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
                        [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
                        [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
                        [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
                        [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
                        [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
                        [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
                        [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
                        [180.3, 83.2], [180.3, 83.2]
                    ],
                    markPoint : {
                        data : [
                            {type : 'max', name: 'Max'},
                            {type : 'min', name: 'Min'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: 'Average'}
                        ]
                    }
                }
            ]
        };
        function random(){
            var r = Math.round(Math.random() * 100);
            return (r * (r % 2 == 0 ? 1 : -1));
        }
        function randomDataArray() {
            var d = [];
            var len = 100;
            while (len--) {
                d.push([
                    random(),
                    random(),
                    Math.abs(random()),
                ]);
            }
            return d;
        }        
        $scope.scatter2.options = {
            tooltip : {
                trigger: 'axis',
                showDelay : 0,
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                }
            },
            legend: {
                data:['scatter1','scatter2']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            xAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitNumber: 4,
                    scale: true
                }
            ],
            series : [
                {
                    name:'scatter1',
                    type:'scatter',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: randomDataArray()
                },
                {
                    name:'scatter2',
                    type:'scatter',
                    symbolSize: function (value){
                        return Math.round(value[2] / 5);
                    },
                    data: randomDataArray()
                }
            ]
        };

        $scope.radar1.options = {
            title : {
                text: 'Budget vs spending'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                orient : 'vertical',
                x : 'right',
                y : 'bottom',
                data:['Allocated Budget','Actual Spending']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            polar : [
               {
                   indicator : [
                       { text: 'sales', max: 6000},
                       { text: 'dministration', max: 16000},
                       { text: 'Information Techology', max: 30000},
                       { text: 'Customer Support', max: 38000},
                       { text: 'Development', max: 52000},
                       { text: 'Marketing', max: 25000}
                    ]
                }
            ],
            calculable : true,
            series : [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data : [
                        {
                            value : [4300, 10000, 28000, 35000, 50000, 19000],
                            name : 'Allocated Budget'
                        },
                         {
                            value : [5000, 14000, 28000, 31000, 42000, 21000],
                            name : 'Actual Spending'
                        }
                    ]
                }
            ]
        };
        $scope.radar2.options = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                x : 'center',
                data:['Ronaldo','Andriy Shevchenko']
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            calculable : true,
            polar : [
                {
                    indicator : [
                        {text : 'Attack', max  : 100},
                        {text : 'Guard', max  : 100},
                        {text : 'Physical', max  : 100},
                        {text : 'Speed', max  : 100},
                        {text : 'Strength', max  : 100},
                        {text : 'Skill', max  : 100}
                    ],
                    radius : 130
                }
            ],
            series : [
                {
                    name: 'Full of live data',
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    },
                    data : [
                        {
                            value : [97, 42, 88, 94, 90, 86],
                            name : 'Andriy Shevchenko'
                        },
                        {
                            value : [97, 32, 74, 95, 88, 92],
                            name : 'Ronaldo'
                        }
                    ]
                }
            ]
        };

        $scope.gauge1.options = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            series : [
                {
                    name:'Business metric',
                    type:'gauge',
                    detail : {formatter:'{value}%'},
                    data:[{value: 50, name: 'Completion'}]
                }
            ]
        };



        $scope.chord1.options = {
            title : {
                text: 'Test Data',
                subtext: 'From d3.js',
                x:'right',
                y:'bottom'
            },
            tooltip : {
                trigger: 'item',
                formatter: function (params) {
                    if (params.indicator2) { // is edge
                        return params.value.weight;
                    } else {// is node
                        return params.name
                    }
                }
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            legend: {
                x: 'left',
                data:['group1','group2', 'group3', 'group4']
            },
            series : [
                {
                    type:'chord',
                    sort : 'ascending',
                    sortSub : 'descending',
                    showScale : true,
                    showScaleText : true,
                    data : [
                        {name : 'group1'},
                        {name : 'group2'},
                        {name : 'group3'},
                        {name : 'group4'}
                    ],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            }
                        }
                    },
                    matrix : [
                        [11975,  5871, 8916, 2868],
                        [ 1951, 10048, 2060, 6171],
                        [ 8010, 16145, 8090, 8045],
                        [ 1013,   990,  940, 6907]
                    ]
                }
            ]
        };

        $scope.funnel1.options = {
            title : {
                text: 'Funnel'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true, title: "restore"},
                    saveAsImage : {show: true, title: "save as image"}
                }
            },
            legend: {
                data : ['Display','Click','Vist','Contact','Order']
            },
            calculable : true,
            series : [
                {
                    name:'Funnel',
                    type:'funnel',
                    width: '40%',
                    data:[
                        {value:60, name:'Vist'},
                        {value:40, name:'Contact'},
                        {value:20, name:'Order'},
                        {value:80, name:'Click'},
                        {value:100, name:'Display'}
                    ]
                },
                {
                    name:'Pyramid',
                    type:'funnel',
                    x : '50%',
                    sort : 'ascending',
                    itemStyle: {
                        normal: {
                            label: {
                                position: 'left'
                            }
                        }
                    },
                    data:[
                        {value:60, name:'Vist'},
                        {value:40, name:'Contact'},
                        {value:20, name:'Order'},
                        {value:80, name:'Click'},
                        {value:100, name:'Display'}
                    ]
                }
            ]
        };
    })
    .controller('AppCtrl',function($scope, $rootScope, $state, $document, appConfig,$http,buildings,$location){
        
        $scope.recommendation_alert = 0;

        $scope.close_recommendation_alert = function(){
            $scope.recommendation_alert = 0;
        }

        $rootScope.recommendations=0;
        $rootScope.toolbox = {
            show : true,
            feature : {
                restore : {show: true, title: "Restore"},
                saveAsImage : {show: true, title: "Save as image"},
                dataZoom : {show: true,title:{zoom:"Zoom",back:"Reset Zoom"}},
                dataView : {show: false,title:"DataView",lang: ['Data View', 'Back','Close']},
                magicType : {show: true, type: ['line', 'bar'],title:{
                    line: 'Line',
                    bar: 'Bar',
                    force: 'Force',
                    chord: 'Chord',
                    pie: 'Pie',
                    funnel: 'Funnel'
                }},
            }
        };
        $rootScope.connectToRuleEngine = function(school_id){
                
                $rootScope.recommendations = 0;
                $scope.$watch('$rootScope.recommendations', function(newValue, oldValue) {
                    console.log(newValue);
                    console.log("WATCH WORKS");
                    $rootScope.recommendation_alert = 1;
                    // angular copy will preserve the reference of $scope.someVar
                    // so it will not trigger another digest 
                    angular.copy($rootScope.recommendations, $scope.someVar);

                });


                console.log('Web Sockets Connection');
                var socket = new SockJS('http://150.140.5.63:8080/gs-guide-notification');
                var stompClient = Stomp.over(socket);
                
                stompClient.connect({}, function (f) {
                       stompClient.subscribe('/recommendations/'+school_id, function (message) {
                        console.log("MESSAGE ALERT"); 
                        console.log(message);
                        $rootScope.recommendations++;

                        console.log("Recommendations: "+$rootScope.recommendations);
                        $rootScope.recommendation_alert = 1;

                    });
                });

                var req = {
                    method: 'GET',
                    url: appConfig.main.apis.cnit+'building/'+school_id+'/events',
                     headers: {
                       'Content-Type': 'application/json'
                     }
                };
                    $http(req).then(function(d){
                          console.log("TRIGGERRRR");
                          console.log(d);
                          
                    }, function(e){
                        console.log(e);
                    });

        
        }
        
      
                     if(appConfig.main.auth_token==""){
                        $location.url('/page/signin');
                    }else{
                        console.log(appConfig.main.auth_token);
                    }

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;



        $scope.$watch('main', function(newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.main.fixedHeader = true;
                    $scope.main.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.main.fixedHeader = false;
                    $scope.main.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.main.fixedSidebar = false;
            }
        }, true);


        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });

        $rootScope.convertToTextMonth = function(month_num){

            if(month_num==1)
                return "Jan";
            else if(month_num==2)
                return "Feb";
            else if(month_num==3)
                return "Mar";
            else if(month_num==4)
                return "Apr";
            else if(month_num==5)
                return "May";
            else if(month_num==6)
                return "Jun";
            else if(month_num==7)
                return "Jul";
            else if(month_num==8)
                return "Aug";
            else if(month_num==9)
                return "Sep";
            else if(month_num==10)
                return "Oct";
            else if(month_num==11)
                return "Nov";
            else if(month_num==12)
                return "Dec";
            else
                return "Null";

        }
        
    })
       
    

})(); 

