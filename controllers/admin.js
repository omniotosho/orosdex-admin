var index = async (req, res) => {
	var user = req.session.user;
	return res.render('./admin-settings', {user: user});
}

module.exports = {
	index: index
}