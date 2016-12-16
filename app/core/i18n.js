(function () {

    angular.module('app.i18n', ['pascalprecht.translate'])
        .config(['$translateProvider', i18nConfig])
        .controller('LangCtrl', ['$scope', '$translate', LangCtrl]);

    // English, Español, 日本語, 中文, Deutsch, français, Italiano, Portugal, Русский язык, 한국어
    // Note: Used on Header, Sidebar, Footer, Dashboard
    // English:            EN-US
    // Spanish:            Español ES-ES
    // Chinese:            简体中文 ZH-CN
    // Chinese:            繁体中文 ZH-TW
    // French:             français FR-FR

    // Not used:
    // Portugal:         Portugal PT-BR
    // Russian:            Русский язык RU-RU
    // German:             Deutsch DE-DE
    // Japanese:         日本語 JA-JP
    // Italian:            Italiano IT-IT
    // Korean:             한국어 KO-KR


    function i18nConfig($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);
    }

    function LangCtrl($scope, $translate) {
        $scope.lang = 'English';
        $scope.setLang = setLang;
        $scope.getFlag = getFlag;


        function setLang (lang) {
            switch (lang) {
                case 'English':
                    $translate.use('en');
                    break;
                case 'Greek':
                    $translate.use('el');
                    break;
                case 'Swidian':
                    $translate.use('sw');
                    break;
                case 'Italy':
                    $translate.use('it');
                    break;
                
            }
            return $scope.lang = lang;
        };

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
