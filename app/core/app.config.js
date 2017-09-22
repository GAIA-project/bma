(function() {
    'use strict';

    angular.module('app.core').directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    }).factory('appConfig', [appConfig])
        .config(['$mdThemingProvider', mdConfig]);


    function appConfig($location,$state) {
                
        var pageTransitionOpts = [
            {
                name: 'Fade up',
                "class": 'animate-fade-up'
            }, {
                name: 'Scale up',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
                "class": 'animate-flip-y'
            }
        ];
        var date = new Date();
        var year = date.getFullYear();
        var main = {
            debug:true,
            selected_building:0,
            logo:'images/logo.png',
            brand: 'Gaia',            
            TheUserName:'',
            username:'greenmindset20',    //false in sparkworks
            password:'16A321368Ca',       //used in sparkworks
            name: 'Lisa',
            year: year,
            layout: 'wide',                                 // String: 'boxed', 'wide'
            menu: 'vertical',                               // String: 'horizontal', 'vertical'
            isMenuCollapsed: false,                         // Boolean: true, false
            fixedHeader: true,                              // Boolean: true, false
            fixedSidebar: true,                             // Boolean: true, false
            pageTransition: pageTransitionOpts[0],          // Object: 0, 1, 2, 3 and build your own
            skin: '12',                                      // String: 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36,
            apis:{
                authentication          :'https://sso.sparkworks.net/aa/oauth/token',
                main                    :'https://api.sparkworks.net/v1/',
                getRole                 :'https://sso.sparkworks.net/aa/user',
                myresource              :'myresource',
                over_db                 :'http://150.140.5.64:8080/GaiaAnalytics/gaia/',
                over_new_api            :'https://buildings.gaia-project.eu/gaia-building-knowledge-base/',
                getAnomalies            :'anomaly/events/getall',
                buildings               :'utility/buildings/getall',
                buildings_post          :'utility/buildings',
                building                :'utility/buildings/getbyid/',
                gatewaysByBuilding      :'utility/gateways/getall/',
                sensorsByArea           :'utility/sensors/getbyarea/',                
                areas                   :'utility/areas',
                area                    :'utility/areas/getbyid/',
                subareas                :'utility/subareas',
                areasByBuilding         :'utility/areas/getall',                
                sites                   :'location/site',
                site                    :'location/site',
                cnit                    :'http://150.140.5.63:8080/',
                uom                     :'uom',
                siteInfo                :'siteInfo/search/findBySiteId'
                
            },
            buildings:[],
            auth_token:'none',
            auth_role : ''            
        };

        if(main.debug==true){
            main.TheUserName='mpoufard';
            main.auth_token = 'dc4ed779-07f1-4e1b-9e50-34664d3832a6';
            main.auth_role = 'ROLE_GAIA_GLOBAL_MANAGER';
        }
        var color = {
            primary:    '#009688',
            success:    '#8BC34A',
            info:       '#00BCD4',
            infoAlt:    '#7E57C2',
            warning:    '#FFCA28',
            danger:     '#F44336',
            text:       '#3D4051',
            gray:       '#EDF0F1'
        };


        return {
            pageTransitionOpts: pageTransitionOpts,
            main: main,
            color: color
        }
    }

    function mdConfig($mdThemingProvider) {
        var cyanAlt = $mdThemingProvider.extendPalette('cyan', {
            'contrastLightColors': '500 600 700 800 900',
            'contrastStrongLightColors': '500 600 700 800 900'
        })
        var lightGreenAlt = $mdThemingProvider.extendPalette('light-green', {
            'contrastLightColors': '500 600 700 800 900',
            'contrastStrongLightColors': '500 600 700 800 900'
        })        

        $mdThemingProvider
            .definePalette('cyanAlt', cyanAlt)
            .definePalette('lightGreenAlt', lightGreenAlt);


        $mdThemingProvider.theme('default')
            .primaryPalette('teal', {
                'default': '500'
            })
            .accentPalette('cyanAlt', {
                'default': '500'
            })
            .warnPalette('red', {
                'default': '500'
            })
            .backgroundPalette('grey');
    }

})();