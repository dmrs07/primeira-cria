module.exports = function(app) {
	var categoriasController = app.controllers.CategoriasController;

	app.get('/categorias', 						categoriasController.findAll);
}
