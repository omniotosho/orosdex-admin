

var index = async (req, res) => {
	var user = req.session.user;
	return res.render('./equities', {user: user});
}

module.exports = {
	index: index
}