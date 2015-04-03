module.exports = function() {
	var controller = {};

	controller.findById = function(req, res) {
		req.getConnection(function(err, conn) {

	        var query = 
	        		conn.query("select * from usuarios where id=7", function(err, rows) {
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