(function () {

    angular.module('app.i18n', ['pascalprecht.translate'])
        .config(['$translateProvider', i18nConfig])
        .controller('LangCtrl', ['$scope', '$translate','$rootScope', LangCtrl]);


    function i18nConfig($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');
        if(localStorage.getItem('GAIA-Selected-Language')!='null'){
            $translateProvider.preferredLanguage(localStorage.getItem('GAIA-Selected-Language'));
        }
        $translateProvider.useSanitizeValueStrategy(null);
    }

    function LangCtrl($scope, $translate,$rootScope) {
        $scope.lang = 'English';
        if(localStorage.getItem('GAIA-Selected-Language')!='null'){
            switch (localStorage.getItem('GAIA-Selected-Language')) {
                case 'en':
                    $scope.lang = 'English';
                    break;
                case 'el':
                    $scope.lang = 'Greek';
                    
                    break;
                case 'sw':
                    $scope.lang = 'Swidian';
                    
                    break;
                case 'it':
                    $scope.lang = 'Italy';
                    break;
                
            }
        }
        $scope.setLang = setLang;
        $scope.getFlag = getFlag;


        function setLang (lang) {

            switch (lang) {
                case 'English':
                    $translate.use('en');
                    $rootScope.lang = 'en';
                    localStorage.setItem('GAIA-Selected-Language',$rootScope.lang);
                    
                    break;
                case 'Greek':
                    $translate.use('el');
                    $rootScope.lang = 'el';
                    localStorage.setItem('GAIA-Selected-Language',$rootScope.lang);
                    
                    break;
                case 'Swidian':
                    $translate.use('sw');
                    $rootScope.lang = 'sw';
                    localStorage.setItem('GAIA-Selected-Language',$rootScope.lang);
                    
                    break;
                case 'Italy':
                    $translate.use('it');
                    $rootScope.lang = 'it';
                    localStorage.setItem('GAIA-Selected-Language',$rootScope.lang);
                    
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
