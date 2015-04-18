function verificaAutenticacao (req, res, next) {
	if (req.isAuthenticated()) {
		return next();

	} else {
		res.status('401').json('Por favor, faça login no sistema');

	}
}

module.exports = function(app) {
	var produtosController = app.controllers.ProdutosController;

	app.get('/front', 						verificaAutenticacao, produtosController.front);
	app.post('/salvarproduto',  	verificaAutenticacao, produtosController.save);
	app.get('/listarproduto',   	verificaAutenticacao, produtosController.findAll);
	app.get('/produto/:id', 			verificaAutenticacao, produtosController.findById);
	app.get('/imagem/:id', 			  verificaAutenticacao, produtosController.findImagensByIdProduto);
	app.get('/produtodelete/:id', verificaAutenticacao, produtosController.delete);
	app.post('/upload', 					verificaAutenticacao, produtosController.upload);
	app.get('/deleteimagem/:id',			verificaAutenticacao, produtosController.deleteImagem);
}
