module.exports = function() {
	var controller = {};

  controller.findAll = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query = conn.query("select * from categorias", function(err, rows) {
		                if(err) {
		                    res.json(err);

		                } else {
		                    res.json(rows);

		                }
		            });
    	});
	};

  return controller;
}
