var dashboard = (req, res) => {
	var user = req.session.user;
	res.render('dashboard', {user: user});
}

module.exports = {
	dashboard: dashboard
}