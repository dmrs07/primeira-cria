angular.module('main', ['ngRoute', 'ngResource'])

.config(function($routeProvider, $httpProvider) {

	$httpProvider.interceptors.push('loginInterceptor');

	$routeProvider.when('/front', {
		templateUrl: 'partials/front.html',
		controller: 'ProdutosController'
	});

	$routeProvider.when('/auth', {
		templateUrl: 'partials/auth.html'
	});

	$routeProvider.when('/dashboard', {
		templateUrl: 'partials/dashboard.html'
	});

	$routeProvider.when('/cadastrar-produto', {
		templateUrl: 'partials/produtos/form.html',
		controller: 'ProdutosController'
	});

	$routeProvider.when('/lista-produto', {
		templateUrl: 'partials/produtos/index.html',
		controller: 'ProdutosController'
	});

	$routeProvider.when('/produto/:id', {
		templateUrl: 'partials/produtos/form.html',
		controller: 'ProdutosController'
	});
})

.directive('confirmation', function () {
  return {
    priority: 1,
    terminal: true,
    link: function (scope, element, attr) {
      var msg = attr.confirmation;
      var clickAction = attr.ngClick;

      element.bind('click', function () {
        if (window.confirm(msg)) {
          scope.$eval(clickAction)
        }
      });
    }
  };
});
