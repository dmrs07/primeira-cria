var stringValidate = require('string');

module.exports = function() {
	var controller = {};

	controller.front = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query =
	        		conn.query("select * from produtos limit 6", function(err, rows) {
		                if(err) {
		                    res.json(err);

		                } else {
		                    res.json(rows);

		                }
		            });
    	});
	};

	controller.findAll = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query =
	        		conn.query("select * from produtos order by id desc", function(err, rows) {
		                if(err) {
		                    res.json(err);

		                } else {
		                    res.json(rows);

		                }
		            });
    	});
	};

	controller.findById = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query =
	        		conn.query("select * from produtos where id = " + req.params.id, function(err, rows) {
		                if(err) {
		                    res.json(err);

		                } else {
		                    res.json(rows);

		                }
		            });
    	});
	};

	controller.findImagensByIdProduto = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query =
	        		conn.query("select id, CAST(imagem AS char(100000)) as imagem from imagens where produto_id = " + req.params.id, function(err, rows) {
		                if(err) {
		                    res.json(err);

		                } else {
		                    res.json(rows);

		                }
		            });
    	});
	};

	controller.save = function(req, res) {
		var data = req.body;
		var msgSucesso;

		req.getConnection(function(err, conn) {

		var sql = null;

		if(data.isUpdate) {
			sql = "update produtos "
					+ "set nome = 		'" + data.nome + "', "
					+ "descricao = 		'" + data.descricao + "', "
					+ "marca = 				'" + data.marca + "', "
					+ "tamanho = 			'" + data.tamanho + "', "
					+ "preco = 				'" + data.preco + "', "
					+ "genero = 			'" + data.genero + "', "
					+ "categoria_id = '" + data.categoria + "' "
					+ "where id = 		'" + data.id + "'";

					msgSucesso = "Item atualizado com sucesso";
		} else {
			sql = "insert into produtos (nome, descricao, marca, tamanho, preco, genero, categoria_id, usuario_id)" +
					"values ('"+data.nome+"', '"+data.descricao+"', '"+data.marca+"', '"+data.tamanho+"', '"+data.preco+"', '"+data.genero+"', '"+data.categoria+"', '"+req.user.id+"')";

			msgSucesso = "Item inserido com sucesso";
		}

		var query =
			conn.query(sql, function(err, rows) {
						if(err) {
								res.json(500, err);

						} else {
								res.json(msgSucesso);

						}
				});
		});

	};

	controller.delete = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query =
	        		conn.query("delete from produtos where id = " + req.params.id, function(err, rows) {
		                if(err) {
		                    res.json(err);

		                } else {
		                    res.json("Operação realizada com sucesso");

		                }
		            });
    	});
	};

	controller.upload = function(req, res) {
		console.log("Inicio Produto Upload Imagem");

		var data = req.body;
		var sql = null;

		sql = "insert into imagens (imagem, produto_id)" +
					"values ('"+data.img+"', '"+data.produto+"')";

		req.getConnection(function(err, conn) {

			console.log("Processando upload...");

        var query =
        		conn.query(sql, function(err, rows) {
	                if(err) {
	                    res.json(err);

	                } else {
	                    res.json("Operação realizada com sucesso");

	                }
	            });
    	});

			console.log("Fim Produto Upload Imagem");
	};

	controller.deleteImagem = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query =
	        		conn.query("delete from imagens where id = " + req.params.id, function(err, rows) {
		                if(err) {
		                    res.json(err);

		                } else {
		                    res.json("Operação realizada com sucesso");

		                }
		            });
    	});
	};

	return controller;
}
