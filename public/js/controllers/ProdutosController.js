angular.module('main').controller('ProdutosController',

function($scope, $http, $routeParams, $location) {
	$scope.rows = {};
	$scope.row = {};

	$(document).ready(function(){
		$('#nome').focus();

		var response = $http.get("/categorias/");

		response.success(function(data, status, headers, config) {
			$scope.categorias = data;
		}).

		error(function(data, status, headers, config) {
			console.log(data);
		});

	});

	$scope.findAll = function() {
		var response = $http.get("/listarproduto/");

		response.success(function(data, status, headers, config) {
			$scope.rows = data;
		}).

		error(function(data, status, headers, config) {
			console.log(data);
		});
	}

	$scope.findById = function() {
		if($routeParams.id) {
			$http.get("/produto/" + $routeParams.id)
			.success(function(data) {
				$scope.row = data[0];
				$scope.row.isUpdate = true;
			});
		}
	}

	$scope.save = function() {
		var response = $http.post("/salvarproduto/", $scope.row);

		response.success(function(data, status, headers, config) {
			$scope.msg = data;

			if(!$scope.row.isUpdate) {
				$scope.row = {};
			}
		}).

		error(function(data, status, headers, config) {
			console.log("ERRO: " + data + " STATUS: " + status);
		});
	}

	$scope.delete = function(id) {
			var response = $http.get("/produtodelete/" + id);

			$scope.findAll();
	}
});
