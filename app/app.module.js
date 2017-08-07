(function () {
    'use strict';

    angular.module('app', [
        // Core modules
         'app.core',
         'app.i18n',
        
        // Custom Feature modules
        ,'app.chart'
        ,'app.ui'
        ,'app.ui.form'
        ,'app.ui.form.validation'
        ,'app.page'
        ,'app.table'
        
        // 3rd party feature modules
        ,'mgo-angular-wizard'
        ,'ui.tree'
        ,'ngMap'
        ,'textAngular'
    ]);

})();

