function verificaAutenticacao (req, res, next) {
	if (req.isAuthenticated()) {
		return next();

	} else {
		res.status('401').json('Por favor, faça login no sistema');

	}
}

module.exports = function(app) {
	var categoriasController = app.controllers.CategoriasController;

	app.get('/categorias', verificaAutenticacao, categoriasController.findAll);
}
