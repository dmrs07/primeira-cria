angular.module('main', ['ngRoute'])

.config(function($routeProvider) {

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
});