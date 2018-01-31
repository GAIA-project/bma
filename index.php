<!doctype html>
<html class="no-js">
    <head>
    <?php 
        $version = 7521;
    ?>

        <meta charset="utf-8">
        <base href="/">
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title><?php //echo $version; ?>GAIA - Building Manager </title>
        <meta name="description" content="GAIA - Building Manager Application">
        <meta name="keywords" content="Gaia,project,eu,building,manager,application,energy">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="icon" type="image/png" href="favicon.png" />
        <link rel="stylesheet" href="styles/loader.css?v=<?php echo $version; ?>">
        <link href='http://fonts.googleapis.com/css?family=Roboto:400,100,500,700,300,300italic,500italic|Roboto+Condensed:400,300' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css?v=<?php echo $version; ?>">
        <link rel="stylesheet" href="bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css?v=<?php echo $version; ?>">
        <!-- end Needs images -->
        
            <link href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css" />
            <link rel="stylesheet" href="bower_components/angular-material/angular-material.min.css?v=1.1">
            <link rel="stylesheet" href="styles/bootstrap.css?v=<?php echo $version; ?>">
            <link rel="stylesheet" href="styles/ui.css?v=<?php echo $version; ?>">
            <link rel="stylesheet" href="styles/main.css?v=<?php echo $version; ?>">
            <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css?v=<?php echo $version; ?>">

            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js?v=<?php echo $version; ?>"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js?v=<?php echo $version; ?>"></script>
            


            <!-- endbuild -->
            <script src="https://cdn.jsdelivr.net/sockjs/1/sockjs.min.js"></script>
            <script src="vendors/stomp.js?v=<?php echo $version; ?>"></script>
            <script src="vendors/canvas2image.js?v=<?php echo $version; ?>"></script>
            <script src="vendors/base64.js?v=<?php echo $version; ?>"></script>
            <script src="vendors/html2canvas.js?v=<?php echo $version; ?>"></script>
            
            <!-- Piwik -->
            <script type="text/javascript">
              var _paq = _paq || [];
              /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="//piwic.gaia-project.eu/";
                _paq.push(['setTrackerUrl', u+'piwik.php']);
                _paq.push(['setSiteId', '1']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
              })();
            </script>
            <!-- End Piwik Code -->

    </head>
    <body data-ng-app="app"
          id="app"
          class="app"
          data-custom-page 
          data-ng-controller="AppCtrl"
          data-ng-class=" { 'layout-boxed': main.layout === 'boxed', 
                            'nav-collapsed-min': main.isMenuCollapsed
          } ">
        <!--[if lt IE 9]>
            <div class="lt-ie9-bg">
                <p class="browsehappy">You are using an <strong>outdated</strong> browser.</p>
                <p>Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
            </div>
        <![endif]-->

        <div id="loader-container"></div>

         <div style="display:none">
            <oauth
                site="https://sso.sparkworks.net/aa"
                client-id="gaia_bma"
                redirect-uri="http://devbms.gaia-project.eu"
                profile-uri="#/page/buildings"
                scope="read"
                storage="localstorage">
            </oauth>


        </div>
       

        <header data-ng-include=" 'app/layout/header.html' "
                 id="header"
                 class="header-container "
                 data-ng-class="{ 'header-fixed': main.fixedHeader,
                                  'bg-white': ['11','12','13','14','15','16','21'].indexOf(main.skin) >= 0,
                                  'bg-dark': main.skin === '31',
                                  'bg-primary': ['22','32'].indexOf(main.skin) >= 0,
                                  'bg-success': ['23','33'].indexOf(main.skin) >= 0,
                                  'bg-info': ['24','34'].indexOf(main.skin) >= 0,
                                  'bg-warning': ['25','35'].indexOf(main.skin) >= 0,
                                  'bg-danger': ['26','36'].indexOf(main.skin) >= 0
                 }"></header>

        <div class="main-container"
             data-ng-class="{ 'app-nav-horizontal': main.menu === 'horizontal' }">
            <aside data-ng-include=" 'app/layout/sidebar.html' "
                   id="nav-container"
                   class="nav-container"  
                   data-ng-class="{ 'nav-fixed': main.fixedSidebar,
                                    'nav-horizontal': main.menu === 'horizontal',
                                    'nav-vertical': main.menu === 'vertical',
                                    'bg-white': ['31','32','33','34','35','36'].indexOf(main.skin) >= 0,
                                    'bg-dark': ['31','32','33','34','35','36'].indexOf(main.skin) < 0
                   }">
            </aside>

            <div id="content" class="content-container">
                <section data-ui-view
                         class="view-container {{main.pageTransition.class}}"></section>
            </div>
        </div>

        



        
        
        <!-- build:js scripts/vendor.js -->
        <script src="bower_components/jquery/dist/jquery.min.js?v=<?php echo $version; ?>"></script>
        <script src="bower_components/angular/angular.min.js?v=<?php echo $version; ?>"></script>


        
        <script src="bower_components/angular-animate/angular-animate.min.js?v=<?php echo $version; ?>"></script>
        <script src="bower_components/angular-aria/angular-aria.min.js?v=<?php echo $version; ?>"></script>
        <script src="bower_components/angular-messages/angular-messages.min.js?v=<?php echo $version; ?>"></script>
        <script src="bower_components/angular-ui-router/release/angular-ui-router.min.js?v=<?php echo $version; ?>"></script>
        <!-- endbuild -->


        <!-- build:js scripts/ui.js -->
        <script src="bower_components/angular-material/angular-material.min.js?v=1.1"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js?v=1.1"></script>
        <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js?v=1.1"></script>
        <script src="bower_components/jquery.slimscroll/jquery.slimscroll.min.js?v=1.1"></script>

        <script src="bower_components/angular-ui-tree/dist/angular-ui-tree.min.js?v=1.1"></script>
        <script src="bower_components/ngmap/build/scripts/ng-map.min.js?v=1.1"></script>
        <script src="bower_components/angular-scroll/angular-scroll.min.js?v=1.1"></script>
        <script src="bower_components/angular-validation-match/dist/angular-validation-match.min.js?v=1.1"></script>

        <script src="bower_components/jquery-steps/build/jquery.steps.min.js?v=1.1"></script>
        <script src="bower_components/angular-wizard/dist/angular-wizard.min.js?v=1.1"></script>

        <script src="bower_components/textAngular/dist/textAngular-rangy.min.js?v=1.1"></script>
        <script src="bower_components/textAngular/dist/textAngular.min.js?v=1.1"></script>
        <script src="bower_components/textAngular/dist/textAngular-sanitize.min.js?v=1.1"></script>

        <script src="bower_components/angular-translate/angular-translate.min.js?v=1.1"></script>
        <script src="bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js?v=1.1"></script>

        <!-- <script src="vendors/echarts.js?v=1.1"></script>         -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/3.4.0/echarts.common.min.js?v=1.1"></script>
        <script src="vendors/ngecharts.js?v=1"></script>



        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>



        <!-- endbuild -->
<!--Controllers-->
        
        

        <!-- build:js scripts/app.js -->
        <!-- inject:js -->
        <script src="app/app.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/chart/chart.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/layout/layout.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/ui/ui.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/page/page.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/form/form.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/form/formValidation.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/core/core.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/table/table.module.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/sitesController.js?v=<?php echo $version; ?>"></script>
        <script src="app/chart/echarts.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/dashboard/dashboard.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/authentication.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/site.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/Anomaly.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/Sensor.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/Commuting.js?v=<?php echo $version; ?>"></script>
        
        <script src="app/factories/uom.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/area.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/theArea.js?v=<?php echo $version; ?>"></script>
        <script src="app/factories/sites.js?v=<?php echo $version; ?>"></script>
        <script src="app/layout/layout.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/layout/layout.diretive.js?v=<?php echo $version; ?>"></script>
        <script src="app/layout/loader.js?v=<?php echo $version; ?>"></script>
        <script src="app/layout/sidebar.directive.js?v=<?php echo $version; ?>"></script>
        <script src="app/ui/material.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/ui/ui.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/ui/ui.directive.js?v=<?php echo $version; ?>"></script>
        <script src="app/page/page.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/page/page.directive.js?v=<?php echo $version; ?>"></script>
        <script src="app/form/form.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/form/form.directive.js?v=<?php echo $version; ?>"></script>
        <script src="app/form/formValidation.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/form/wizard.controller.js?v=<?php echo $version; ?>"></script>
        <script src="app/core/app.config.js?v=<?php echo $version; ?>"></script>
        <script src="app/core/app.controller.js?v=13<?php echo $version; ?>"></script>
        <script src="app/bower_components/angular-route.js"></script>

        
        
        <script src="app/core/config.route.js?v=<?php echo $version; ?>"></script>
        <script src="app/core/i18n.js?v=<?php echo $version; ?>"></script>
        <script src="app/table/table.controller.js?v=<?php echo $version; ?>"></script>
        <script src="vendors/angular-piwik.js?v=<?php echo $version; ?>"></script>

        
        <!-- endinject -->
        <!-- build:js scripts/app.js -->
        
        
        
        
    <!--Factories-->
        
    <script src="app/factories/sites.js?v=1"></script>
    <script src="app/factories/site.js?v=1"></script>


    <!-- bower:js -->
    <script src="bower_components/ngstorage/ngStorage.js"></script>
    <script src="bower_components/jsrsasign/jsrsasign-latest-all-min.js"></script>
    <!-- endbower -->

    <!-- build:js({.tmp,app}) oauth-ng.js -->
    <script src="scripts/app.js"></script>
    <script src="scripts/services/id-token.js"></script>
    <script src="scripts/services/oidc-config.js"></script>
    <script src="scripts/services/access-token.js"></script>
    <script src="scripts/services/endpoint.js"></script>
    <script src="scripts/services/profile.js"></script>
    <script src="scripts/services/storage.js"></script>
    <script src="scripts/services/oauth-configuration.js"></script>
    <script src="scripts/interceptors/oauth-interceptor.js"></script>
    <script src="scripts/directives/oauth.js"></script>


        <script src="app/controllers/sitesController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/LogoutController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/SiteSensorsController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/SiteResourcesComparisonController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/SensorController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/BuildingRulesController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/SiteAreasController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/SiteSensorsComparisonController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/SiteAnomaliesController.js?v=<?php echo $version; ?>"></script>
        <script src="app/controllers/SiteVisibleStructureController.js?v=<?php echo $version; ?>"></script>



        
<style>
.md-virtual-repeat-container {
    width: auto!important;
}
</style>


    </body>
</html>
