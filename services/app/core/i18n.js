(function () {

    angular.module('app.i18n', ['pascalprecht.translate'])
        .config(['$translateProvider', i18nConfig])
        .controller('LangCtrl', ['$scope', '$translate','$rootScope', LangCtrl]);


    function i18nConfig($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('el');
        $translateProvider.useSanitizeValueStrategy(null);
    }

    function LangCtrl($scope, $translate,$rootScope) {
        $scope.lang = 'Greek';
        $scope.setLang = setLang;
        $scope.getFlag = getFlag;


        function setLang (lang) {
            switch (lang) {
                case 'English':
                    $translate.use('en');
                    $rootScope.lang = 'en';
                    
                    break;
                case 'Greek':
                    $translate.use('el');
                    $rootScope.lang = 'el';
                    
                    break;
                case 'Swidian':
                    $translate.use('sw');
                    $rootScope.lang = 'sw';
                    
                    break;
                case 'Italy':
                    $translate.use('it');
                    $rootScope.lang = 'it';
                    
                    break;
                
            }
            return $scope.lang = lang;
        };

       
        $rootScope.getLanguage = function(){
            return $scope.lang;
        }
        function getFlag() {
            var lang;
            lang = $scope.lang;
            switch (lang) {
                case 'English':
                    return 'flags-english';
                    break;
                case 'Greek':
                    return 'flags-greek';
                    break;
                case 'Swidian':
                    return 'flags-swidian';
                    break;
                case 'Portugal':
                    return 'flags-portugal';
                    break;
                case 'Italy':
                    return 'flags-italy';
                    break;
                case 'Русский язык':
                    return 'flags-russia';
                    break;
            }
        };

    }

})(); 
