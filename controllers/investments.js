var index = async (req, res) => {
	var user = req.session.user;
	res.render('./investments', {user: user});
}

module.exports = {
	index: index
}