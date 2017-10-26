(function () {
    'use strict';

    angular.module('app.core', [
        // Angular modules
         'ngAnimate'
        ,'ngAria'
        ,'ngMessages'
        ,'piwik'
        ,'oauth'
        ,'ngRoute'

        // Custom modules
        ,'app.layout'
        ,'app.i18n'
        ,'app.chart'
        
        // 3rd Party Modules
        ,'ngMaterial'
        ,'ui.router'
        ,'ui.bootstrap'
        ,'duScroll'
    ]);

})();

