
/*
 * GET games listing.
 */

exports.list = function(req, res){
	res.send('user: ' + req.session.userId);
};