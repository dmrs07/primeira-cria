angular.module('main')

.factory('loginInterceptor', function($location, $q) {

  var interceptor = {

    responseError: function(resposta) {

      if (resposta.status == 401) {
        $location.path('/');
      }

      return $q.reject(resposta);
    }
  }

  return interceptor;

});
