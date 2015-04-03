module.exports = function(app) {
	var produtosController = app.controllers.ProdutosController;

	app.get('/front', 			produtosController.front);
	app.post('/salvarproduto',  produtosController.save);
	app.get('/listarproduto',   produtosController.findAll);
	app.get('/produto/:id', 		produtosController.findById);
}