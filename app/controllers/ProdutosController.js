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

	controller.save = function(req, res) {
		req.getConnection(function(err, conn) {
			var data = req.body;
			var sql = null;

				if(data.isUpdate) {
					sql = "update produtos "
						  + "set nome = '" + data.nome + "', "
						  + "descricao = '" + data.descricao + "', "
						  + "marca = '" + data.marca + "', "
						  + "tamanho = '" + data.tamanho + "', "
						  + "preco = '" + data.preco + "', "
						  + "genero = '" + data.genero + "' "
						  + "where id = '" + data.id + "'";
				} else {
					sql = "insert into produtos (nome, descricao, marca, tamanho, preco, genero)" +
					 	  "values ('"+data.nome+"', '"+data.descricao+"', '"+data.marca+"', '"+data.tamanho+"', '"+data.preco+"', '"+data.genero+"')";

				}

	        var query =
        		conn.query(sql, function(err, rows) {
	                if(err) {
	                    res.json(err);

	                } else {
	                    res.json("Operação com sucesso!");

	                }
	            });
    	});
	};

	return controller;
}
