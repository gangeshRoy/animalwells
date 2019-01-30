var strData = [];
var app = angular.module('animalwells', ['720kb.socialshare', 'angularGrid']);
var isChangeLocation = false;

app.config(['$httpProvider', '$qProvider', '$animateProvider', function ($httpProvider, $qProvider, $animateProvider) {
    $httpProvider.defaults.headers.common = {
        'x-access-token': commonPre.readFromStorage('animalwells'),
        'X-Key': commonPre.readFromStorage('key')
    };
    $qProvider.errorOnUnhandledRejections(false);
    $animateProvider.classNameFilter(/\cardBr\b/);
}]);




app.run(function ($rootScope) {
    $rootScope.utyp = utyp ? utyp : '';
    $rootScope.uid = uuid ? uuid : '';
    $rootScope.username = uname ? uname : '';
    $rootScope.IMGDOMAIAN = UDOMAIN;
    $rootScope.DOMAIAN = UDOMAIN;
});




app.factory('dataFactory', [
    '$http',
    function ($http, dt) {
        var dataFactory = {};
        dataFactory.getPostData = function (url, dt) {
            return $http({
                //  url: (url!=='/login' ? NODOMAIN+url : url),
                url: url,
                headers: {
                    'x-access-token': commonPre.readFromStorage('animalwells'),
                    'X-Key': commonPre.readFromStorage('key'),
                },
                method: 'POST',
                data: dt,
            });
        };

        dataFactory.getData = function (url) {
            return $http({
                //  url:NODOMAIN+ url,
                url: url,
                method: 'GET',
                headers: {
                    'x-access-token': commonPre.readFromStorage('animalwells'),
                    'X-Key': commonPre.readFromStorage('key')
                },
            });
        };



        dataFactory.validateUser = function (url) {
            var prevKey = common.getCookie('key');
            var prevTk = common.getCookie('animalwells');

            var lkey = commonPre.readFromStorage('key');
            var lToken = commonPre.readFromStorage('animalwells');

            if (prevKey && prevTk) {
                if (!lkey) {
                    commonPre.addToStorage('key', prevKey);
                    commonPre.addToStorage('animalwells', prevTk);
                }
                else if (!lToken) {
                    commonPre.addToStorage('key', prevKey);
                    commonPre.addToStorage('animalwells', prevTk);
                }
                commonPre.addToStorage('loginStatus', 1);
                commonPre.addToStorage('animalwells2', prevTk);
            }


            var pData = {};
            pData.key = commonPre.readFromStorage('key');
            uuid = pData.key;
            if (uuid)
                isLogin = 1;
            pData.token = commonPre.readFromStorage('animalwells');

            if (commonPre.readFromStorage('key')) {
                var typeUrl = '/utyp/' + commonPre.readFromStorage('key');
                //if (PAGE != 'causers' && PAGE != 'userTracking') {
                    dataFactory.getData(typeUrl).then(function (res) {
                        res = res.data;
                        

                        if(res.isExpired){
                            common.logout();
                            return;
                        }
                        if(res.locationFlag){
                       
                            
                            getLocation();
                        }
                        if (res.typ > 5) {
                            if (res.typ == 7) {
                                if (PAGE !== 'userTracking')
                                    window.location.href = UDOMAIN + 'userTracking/' + commonPre.readFromStorage('key');
                            }
                            else if (res.typ == 6) {
                                if (PAGE != 'causers' && PAGE != 'userTracking') {
                                    window.location.href = UDOMAIN + 'userTracking/' + commonPre.readFromStorage('key');
                                }
                            }
                        }
                        else {
                            
                            if(PAGE == 'home'){
                                if(res.typ == 1)
                                    window.location.href = UDOMAIN +res.uname+ '/feeds';
                                else
                                    window.location.href = UDOMAIN+'bucket-list';
                            }
                        }
                    });
                //}
            }

            else{

                if(PAGE == 'home')
                    $('#contHt').css({opacity:1});

                loadingLoginDiv =true;
                loadLoginForm();
            }

            return $http({
                url: '/userDetails',
                headers: {
                    'x-access-token': commonPre.readFromStorage('animalwells'),
                    'X-Key': commonPre.readFromStorage('key'),
                },
                method: 'POST',
                data: pData,
            });

        };

       

        return dataFactory;
    },
]);